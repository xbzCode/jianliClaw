import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/config/prisma.service';
import { MinioService } from '../../common/config/minio.service';
import { CreateResumeDto, UpdateResumeDto, QueryResumeDto, CreateVersionDto } from './dto/resume.dto';

// 默认的空简历内容
const EMPTY_RESUME_CONTENT = {
  basicInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    portfolio: '',
    linkedin: '',
    github: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};

@Injectable()
export class ResumeService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  // 创建简历
  async create(userId: string, dto: CreateResumeDto) {
    // 如果设置为默认简历，先取消其他默认简历
    if (dto.isDefault) {
      await this.prisma.resume.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const resume = await this.prisma.resume.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        content: dto.content as any,
        tags: dto.tags || [],
        isDefault: dto.isDefault || false,
        version: 1,
      },
    });

    // 创建初始版本记录
    await this.prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        version: 1,
        content: dto.content as any,
        note: '初始版本',
      },
    });

    return this.findOne(resume.id, userId);
  }

  // 获取简历列表
  async findAll(userId: string, query: QueryResumeDto) {
    const { page = 1, limit = 20, search, tags } = query;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = { userId };

    // 搜索条件
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 标签过滤
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      where.tags = { hasSome: tagArray };
    }

    // 并行执行查询和计数
    const [data, total] = await Promise.all([
      this.prisma.resume.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.resume.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 获取单个简历
  async findOne(id: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 10,
        },
      },
    });

    if (!resume) {
      throw new NotFoundException('简历不存在');
    }

    // 验证所有权
    if (resume.userId !== userId) {
      throw new ForbiddenException('无权访问此简历');
    }

    return resume;
  }

  // 更新简历
  async update(id: string, userId: string, dto: UpdateResumeDto) {
    // 验证简历存在且属于当前用户
    const existing = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('简历不存在');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('无权修改此简历');
    }

    // 如果设置为默认简历，先取消其他默认简历
    if (dto.isDefault) {
      await this.prisma.resume.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // 更新简历
    const resume = await this.prisma.resume.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.content !== undefined && { content: dto.content as any }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
        version: { increment: 1 },
      },
    });

    return this.findOne(resume.id, userId);
  }

  // 删除简历
  async remove(id: string, userId: string) {
    // 验证简历存在且属于当前用户
    const existing = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('简历不存在');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('无权删除此简历');
    }

    await this.prisma.resume.delete({
      where: { id },
    });

    return { success: true };
  }

  // 创建新版本
  async createVersion(id: string, userId: string, dto: CreateVersionDto) {
    // 验证简历存在且属于当前用户
    const existing = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('简历不存在');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('无权修改此简历');
    }

    // 更新简历内容和版本号
    const resume = await this.prisma.resume.update({
      where: { id },
      data: {
        content: dto.content as any,
        version: { increment: 1 },
      },
    });

    // 创建版本记录
    await this.prisma.resumeVersion.create({
      data: {
        resumeId: id,
        version: resume.version,
        content: dto.content as any,
        note: dto.note,
      },
    });

    return this.findOne(id, userId);
  }

  // 获取简历版本历史
  async getVersions(id: string, userId: string) {
    // 验证简历存在且属于当前用户
    const existing = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('简历不存在');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('无权访问此简历');
    }

    const versions = await this.prisma.resumeVersion.findMany({
      where: { resumeId: id },
      orderBy: { version: 'desc' },
    });

    return versions;
  }

  // 恢复到指定版本
  async restoreVersion(id: string, userId: string, version: number) {
    // 验证简历存在且属于当前用户
    const existing = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('简历不存在');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('无权修改此简历');
    }

    // 查找指定版本
    const targetVersion = await this.prisma.resumeVersion.findUnique({
      where: { resumeId_version: { resumeId: id, version } },
    });

    if (!targetVersion) {
      throw new NotFoundException('版本不存在');
    }

    // 更新简历内容和版本号
    const resume = await this.prisma.resume.update({
      where: { id },
      data: {
        content: targetVersion.content,
        version: { increment: 1 },
      },
    });

    // 创建新版本记录（标记为恢复版本）
    await this.prisma.resumeVersion.create({
      data: {
        resumeId: id,
        version: resume.version,
        content: targetVersion.content,
        note: `恢复到版本 ${version}`,
      },
    });

    return this.findOne(id, userId);
  }

  // 设置为默认简历
  async setDefault(id: string, userId: string) {
    // 验证简历存在且属于当前用户
    const existing = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('简历不存在');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('无权修改此简历');
    }

    // 取消其他默认简历
    await this.prisma.resume.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // 设置当前简历为默认
    const resume = await this.prisma.resume.update({
      where: { id },
      data: { isDefault: true },
    });

    return resume;
  }

  // 获取默认简历
  async getDefault(userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { userId, isDefault: true },
    });

    return resume;
  }

  // 上传简历文件
  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    title?: string,
    tags?: string[],
  ) {
    // 验证文件类型
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('仅支持PDF和DOCX格式的文件');
    }

    // 上传到MinIO
    const { url, objectName } = await this.minioService.uploadFile(userId, file, 'original');

    // 获取文件类型
    const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'docx';

    // 创建简历记录
    const resumeTitle = title || file.originalname.replace(/\.[^/.]+$/, '');
    const resume = await this.prisma.resume.create({
      data: {
        userId,
        title: resumeTitle,
        content: EMPTY_RESUME_CONTENT as any,
        fileUrl: url,
        fileType,
        tags: tags || [],
        isDefault: false,
        version: 1,
      },
    });

    // 创建初始版本记录
    await this.prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        version: 1,
        content: EMPTY_RESUME_CONTENT as any,
        note: `上传文件: ${file.originalname}`,
      },
    });

    // TODO: 触发异步任务解析文件内容
    // 这里可以调用AI服务来解析PDF/DOCX内容

    return {
      resume: await this.findOne(resume.id, userId),
      parsedContent: null, // 异步解析完成后更新
    };
  }

  // 获取文件下载URL
  async getFileUrl(id: string, userId: string): Promise<string> {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      throw new NotFoundException('简历不存在');
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException('无权访问此简历');
    }

    if (!resume.fileUrl) {
      throw new NotFoundException('该简历没有关联文件');
    }

    // 从fileUrl提取objectName
    // fileUrl格式: presigned URL，需要解析出objectName
    // 这里简化处理，直接返回新的presigned URL
    // 实际应该存储objectName而不是完整URL
    return resume.fileUrl;
  }
}
