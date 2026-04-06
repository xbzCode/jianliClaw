import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateResumeDto, UpdateResumeDto, QueryResumeDto, CreateVersionDto } from './dto/resume.dto';

@ApiTags('简历管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @ApiOperation({ summary: '创建简历' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Request() req: any, @Body() dto: CreateResumeDto) {
    return this.resumeService.create(req.user.userId, dto);
  }

  @Post('upload')
  @ApiOperation({ summary: '上传简历文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'PDF或DOCX文件' },
        title: { type: 'string', description: '简历标题（可选）' },
        tags: { type: 'string', description: '标签（逗号分隔，可选）' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: '上传成功' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
    @Body('tags') tagsStr?: string,
  ) {
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
    return this.resumeService.uploadFile(req.user.userId, file, title, tags);
  }

  @Get()
  @ApiOperation({ summary: '获取简历列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Request() req: any, @Query() query: QueryResumeDto) {
    return this.resumeService.findAll(req.user.userId, query);
  }

  @Get('default')
  @ApiOperation({ summary: '获取默认简历' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getDefault(@Request() req: any) {
    return this.resumeService.getDefault(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个简历' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '简历不存在' })
  async findOne(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.resumeService.findOne(id, req.user.userId);
  }

  @Get(':id/file')
  @ApiOperation({ summary: '获取简历文件下载链接' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '简历或文件不存在' })
  async getFileUrl(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const url = await this.resumeService.getFileUrl(id, req.user.userId);
    return { url };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新简历' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '简历不存在' })
  async update(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumeService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除简历' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '简历不存在' })
  async remove(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.resumeService.remove(id, req.user.userId);
  }

  @Post(':id/version')
  @ApiOperation({ summary: '创建新版本' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 404, description: '简历不存在' })
  async createVersion(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateVersionDto,
  ) {
    return this.resumeService.createVersion(id, req.user.userId, dto);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: '获取版本历史' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '简历不存在' })
  async getVersions(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.resumeService.getVersions(id, req.user.userId);
  }

  @Post(':id/restore/:version')
  @ApiOperation({ summary: '恢复到指定版本' })
  @ApiResponse({ status: 200, description: '恢复成功' })
  @ApiResponse({ status: 404, description: '简历或版本不存在' })
  async restoreVersion(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('version') version: string,
  ) {
    return this.resumeService.restoreVersion(id, req.user.userId, parseInt(version, 10));
  }

  @Post(':id/default')
  @ApiOperation({ summary: '设置为默认简历' })
  @ApiResponse({ status: 200, description: '设置成功' })
  @ApiResponse({ status: 404, description: '简历不存在' })
  async setDefault(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.resumeService.setDefault(id, req.user.userId);
  }
}
