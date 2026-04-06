// 简历内容结构
export interface BasicInfo {
  name: string;
  email: string;
  phone: string;
  location?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements?: string[];
  skills?: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
  level?: number;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Language {
  language: string;
  proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
}

export interface CustomSectionItem {
  title: string;
  description: string;
  date?: string;
}

export interface CustomSection {
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeContent {
  basicInfo: BasicInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications?: Certification[];
  languages?: Language[];
  customSections?: CustomSection[];
}

// 简历数据结构
export interface Resume {
  id: string;
  userId: string;
  title: string;
  description?: string;
  content: ResumeContent;
  fileUrl?: string;
  fileType?: 'pdf' | 'docx' | 'json';
  isDefault: boolean;
  version: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  versions?: ResumeVersion[];
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  version: number;
  content: ResumeContent;
  note?: string;
  createdAt: string;
}

// API请求/响应类型
export interface CreateResumeRequest {
  title: string;
  description?: string;
  content: ResumeContent;
  tags?: string[];
  isDefault?: boolean;
}

export interface UpdateResumeRequest {
  title?: string;
  description?: string;
  content?: ResumeContent;
  tags?: string[];
  isDefault?: boolean;
}

export interface QueryResumeParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 默认空简历内容
export const EMPTY_RESUME_CONTENT: ResumeContent = {
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
