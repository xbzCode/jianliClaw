import { Injectable, OnModuleInit } from '@nestjs/common';
import * as MinIO from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from './config.service';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: MinIO.Client;
  private bucketName: string;
  private isConnected: boolean = false; // 连接状态标记

  constructor(private configService: ConfigService) {
    const minioConfig = this.configService.minio;
    this.bucketName = minioConfig.bucket;

    this.minioClient = new MinIO.Client({
      endPoint: minioConfig.endpoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.user,
      secretKey: minioConfig.password,
    });
  }

  async onModuleInit() {
    try {
      // 确保bucket存在
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`✅ MinIO bucket "${this.bucketName}" 创建成功`);
      }
      this.isConnected = true;
      console.log('✅ MinIO 连接成功');
    } catch (error) {
      this.isConnected = false;
      console.warn('⚠️  MinIO 连接失败，文件上传功能将不可用');
      console.warn('   请启动 MinIO 服务或检查配置：', error.message);
    }
  }

  // 上传文件
  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    folder: 'original' | 'generated' | 'avatars' = 'original',
  ): Promise<{ url: string; objectName: string }> {
    if (!this.isConnected) {
      throw new Error('MinIO 服务不可用，无法上传文件');
    }

    const ext = file.originalname.split('.').pop() || 'bin';
    const objectName = `${userId}/${folder}/${uuidv4()}.${ext}`;

    await this.minioClient.putObject(
      this.bucketName,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
        'X-Original-Filename': Buffer.from(file.originalname).toString('base64'),
      },
    );

    const url = await this.getFileUrl(objectName);
    return { url, objectName };
  }

  // 获取文件URL
  async getFileUrl(objectName: string, expiresIn: number = 7 * 24 * 3600): Promise<string> {
    return await this.minioClient.presignedGetObject(
      this.bucketName,
      objectName,
      expiresIn, // 默认7天有效期
    );
  }

  // 获取文件内容
  async getFile(objectName: string): Promise<Buffer> {
    const stream = await this.minioClient.getObject(this.bucketName, objectName);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  // 删除文件
  async deleteFile(objectName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }

  // 删除用户所有文件
  async deleteUserFiles(userId: string): Promise<void> {
    const objectsList: string[] = [];
    const stream = this.minioClient.listObjects(this.bucketName, `${userId}/`, true);

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => {
        if (obj.name) {
          objectsList.push(obj.name);
        }
      });
      stream.on('error', reject);
      stream.on('end', async () => {
        if (objectsList.length > 0) {
          await this.minioClient.removeObjects(this.bucketName, objectsList);
        }
        resolve();
      });
    });
  }

  // 检查文件是否存在
  async fileExists(objectName: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, objectName);
      return true;
    } catch {
      return false;
    }
  }

  // 获取文件元信息
  async getFileStats(objectName: string): Promise<MinIO.BucketItemStat> {
    return await this.minioClient.statObject(this.bucketName, objectName);
  }
}
