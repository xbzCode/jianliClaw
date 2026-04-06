import { IsString, IsOptional, IsBoolean, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

// 简历内容结构
export class BasicInfoDto {
  @ApiProperty({ description: '姓名' })
  @IsString()
  name: string;

  @ApiProperty({ description: '邮箱' })
  @IsString()
  email: string;

  @ApiProperty({ description: '电话' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: '所在地' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: '作品集链接' })
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiPropertyOptional({ description: 'LinkedIn链接' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({ description: 'GitHub链接' })
  @IsOptional()
  @IsString()
  github?: string;
}

export class WorkExperienceItemDto {
  @ApiProperty({ description: '工作经历ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '公司名称' })
  @IsString()
  company: string;

  @ApiProperty({ description: '职位' })
  @IsString()
  position: string;

  @ApiPropertyOptional({ description: '工作地点' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: '开始日期 (YYYY-MM)' })
  @IsString()
  startDate: string;

  @ApiPropertyOptional({ description: '结束日期 (YYYY-MM 或 "至今")' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ description: '工作描述' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: '主要成就' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiPropertyOptional({ description: '使用技能' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class EducationItemDto {
  @ApiProperty({ description: '教育经历ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '学校名称' })
  @IsString()
  school: string;

  @ApiProperty({ description: '学位' })
  @IsString()
  degree: string;

  @ApiPropertyOptional({ description: '专业' })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({ description: '学校地点' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: '开始日期' })
  @IsString()
  startDate: string;

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'GPA' })
  @IsOptional()
  @IsString()
  gpa?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class SkillCategoryDto {
  @ApiProperty({ description: '技能类别' })
  @IsString()
  category: string;

  @ApiProperty({ description: '技能项' })
  @IsArray()
  @IsString({ each: true })
  items: string[];

  @ApiPropertyOptional({ description: '熟练度 (1-5)' })
  @IsOptional()
  level?: number;
}

export class ProjectItemDto {
  @ApiProperty({ description: '项目ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '项目名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '角色' })
  @IsString()
  role: string;

  @ApiProperty({ description: '项目描述' })
  @IsString()
  description: string;

  @ApiProperty({ description: '使用技术' })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @ApiProperty({ description: '开始日期' })
  @IsString()
  startDate: string;

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: '项目链接' })
  @IsOptional()
  @IsString()
  link?: string;
}

export class CertificationItemDto {
  @ApiProperty({ description: '证书名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '颁发机构' })
  @IsString()
  issuer: string;

  @ApiProperty({ description: '获得日期' })
  @IsString()
  date: string;

  @ApiPropertyOptional({ description: '证书链接' })
  @IsOptional()
  @IsString()
  link?: string;
}

export class LanguageItemDto {
  @ApiProperty({ description: '语言' })
  @IsString()
  language: string;

  @ApiProperty({ description: '熟练程度', enum: ['native', 'fluent', 'intermediate', 'basic'] })
  @IsString()
  proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
}

export class CustomSectionItemDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: '日期' })
  @IsOptional()
  @IsString()
  date?: string;
}

export class CustomSectionDto {
  @ApiProperty({ description: '自定义模块标题' })
  @IsString()
  title: string;

  @ApiProperty({ description: '自定义模块内容' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomSectionItemDto)
  items: CustomSectionItemDto[];
}

// 完整的简历内容
export class ResumeContentDto {
  @ApiProperty({ description: '基础信息' })
  @ValidateNested()
  @Type(() => BasicInfoDto)
  basicInfo: BasicInfoDto;

  @ApiProperty({ description: '工作经历', type: [WorkExperienceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceItemDto)
  workExperience: WorkExperienceItemDto[];

  @ApiProperty({ description: '教育背景', type: [EducationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  education: EducationItemDto[];

  @ApiProperty({ description: '技能', type: [SkillCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillCategoryDto)
  skills: SkillCategoryDto[];

  @ApiProperty({ description: '项目经历', type: [ProjectItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  projects: ProjectItemDto[];

  @ApiPropertyOptional({ description: '证书', type: [CertificationItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationItemDto)
  certifications?: CertificationItemDto[];

  @ApiPropertyOptional({ description: '语言', type: [LanguageItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageItemDto)
  languages?: LanguageItemDto[];

  @ApiPropertyOptional({ description: '自定义模块', type: [CustomSectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomSectionDto)
  customSections?: CustomSectionDto[];
}

// 创建简历DTO
export class CreateResumeDto {
  @ApiProperty({ description: '简历标题' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: '简历描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '简历内容' })
  @ValidateNested()
  @Type(() => ResumeContentDto)
  content: ResumeContentDto;

  @ApiPropertyOptional({ description: '标签' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: '是否为默认简历' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

// 更新简历DTO
export class UpdateResumeDto extends PartialType(CreateResumeDto) {}

// 创建新版本DTO
export class CreateVersionDto {
  @ApiProperty({ description: '新版本内容' })
  @ValidateNested()
  @Type(() => ResumeContentDto)
  content: ResumeContentDto;

  @ApiPropertyOptional({ description: '版本说明' })
  @IsOptional()
  @IsString()
  note?: string;
}

// 查询简历列表DTO
export class QueryResumeDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: '标签过滤 (逗号分隔)' })
  @IsOptional()
  @IsString()
  tags?: string;
}

// 文件上传响应DTO
export class UploadResumeResponseDto {
  @ApiProperty({ description: '简历信息' })
  resume: any;

  @ApiProperty({ description: '解析后的内容', required: false })
  parsedContent?: ResumeContentDto;
}
