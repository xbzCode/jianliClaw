import { apiClient } from './client';
import type {
  Resume,
  CreateResumeRequest,
  UpdateResumeRequest,
  QueryResumeParams,
  PaginatedResponse,
} from '@/lib/types/resume';

export const resumeApi = {
  // 获取简历列表
  getList: async (params?: QueryResumeParams): Promise<PaginatedResponse<Resume>> => {
    const response = await apiClient.get('/resumes', { params });
    return response.data;
  },

  // 获取单个简历
  get: async (id: string): Promise<Resume> => {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data;
  },

  // 获取默认简历
  getDefault: async (): Promise<Resume | null> => {
    const response = await apiClient.get('/resumes/default');
    return response.data;
  },

  // 创建简历
  create: async (data: CreateResumeRequest): Promise<Resume> => {
    const response = await apiClient.post('/resumes', data);
    return response.data;
  },

  // 更新简历
  update: async (id: string, data: UpdateResumeRequest): Promise<Resume> => {
    const response = await apiClient.put(`/resumes/${id}`, data);
    return response.data;
  },

  // 删除简历
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`);
  },

  // 上传简历文件
  upload: async (file: File, title?: string, tags?: string[]): Promise<{ resume: Resume; parsedContent?: any }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (tags && tags.length > 0) formData.append('tags', tags.join(','));

    const response = await apiClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 获取文件下载URL
  getFileUrl: async (id: string): Promise<string> => {
    const response = await apiClient.get(`/resumes/${id}/file`);
    return response.data.url;
  },

  // 设置为默认简历
  setDefault: async (id: string): Promise<Resume> => {
    const response = await apiClient.post(`/resumes/${id}/default`);
    return response.data;
  },

  // 创建新版本
  createVersion: async (id: string, content: any, note?: string): Promise<Resume> => {
    const response = await apiClient.post(`/resumes/${id}/version`, { content, note });
    return response.data;
  },

  // 获取版本历史
  getVersions: async (id: string): Promise<any[]> => {
    const response = await apiClient.get(`/resumes/${id}/versions`);
    return response.data;
  },

  // 恢复到指定版本
  restoreVersion: async (id: string, version: number): Promise<Resume> => {
    const response = await apiClient.post(`/resumes/${id}/restore/${version}`);
    return response.data;
  },
};
