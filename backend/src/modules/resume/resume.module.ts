import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { PrismaService } from '../../common/config/prisma.service';
import { MinioService } from '../../common/config/minio.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, PrismaService, MinioService],
  exports: [ResumeService],
})
export class ResumeModule {}
