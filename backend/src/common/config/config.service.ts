import { Injectable } from '@nestjs/config';

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  url: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface MinioConfig {
  endpoint: string;
  port: number;
  user: string;
  password: string;
  useSSL: boolean;
  bucket: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
}

@Injectable()
export class ConfigService {
  constructor(private configService: NestjsConfigService) {}

  get jwt(): JwtConfig {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'your-secret-key'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
    };
  }

  get database(): DatabaseConfig {
    return {
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      user: this.configService.get<string>('DB_USER', 'jianliclaw'),
      password: this.configService.get<string>('DB_PASSWORD', 'jianliclaw123'),
      name: this.configService.get<string>('DB_NAME', 'jianliclaw'),
      url: this.configService.get<string>(
        'DATABASE_URL',
        'postgresql://jianliclaw:jianliclaw123@localhost:5432/jianliclaw?schema=public',
      ),
    };
  }

  get redis(): RedisConfig {
    return {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD', 'redis123'),
    };
  }

  get minio(): MinioConfig {
    return {
      endpoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: this.configService.get<number>('MINIO_PORT', 9000),
      user: this.configService.get<string>('MINIO_USER', 'minioadmin'),
      password: this.configService.get<string>('MINIO_PASSWORD', 'minioadmin123'),
      useSSL: this.configService.get<boolean>('MINIO_USE_SSL', false),
      bucket: this.configService.get<string>('MINIO_BUCKET', 'resumes'),
    };
  }

  get app(): AppConfig {
    return {
      nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
      port: this.configService.get<number>('PORT', 3001),
      apiPrefix: this.configService.get<string>('API_PREFIX', '/api/v1'),
    };
  }

  get openaiApiKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY', '');
  }

  get aiServiceUrl(): string {
    return this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }
}

// 导入ConfigService类型别名
import { ConfigService as NestjsConfigService } from '@nestjs/config';
