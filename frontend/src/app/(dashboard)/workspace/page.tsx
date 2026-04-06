'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Upload, MoreVertical, Star } from 'lucide-react';
import { resumeApi } from '@/lib/api/resume';
import { useAuthStore } from '@/lib/store/auth-store';
import type { Resume } from '@/lib/types/resume';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function WorkspacePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      loadResumes();
    }
  }, [isAuthenticated]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeApi.getList();
      setResumes(response.data);
    } catch (error) {
      console.error('加载简历列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">简历管理</h1>
        <p className="text-gray-500 mt-1">管理您的简历，创建和编辑简历内容</p>
      </div>

      {/* 操作栏 */}
      <div className="flex gap-3 mb-6">
        <Link href="/workspace/resumes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建简历
          </Button>
        </Link>
        <Link href="/workspace/resumes/upload">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            上传文件
          </Button>
        </Link>
      </div>

      {/* 简历列表 */}
      {resumes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无简历</h3>
          <p className="text-gray-500 mb-4">创建您的第一份简历，开始求职之旅</p>
          <Link href="/workspace/resumes/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              创建简历
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/workspace/resumes/${resume.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {resume.isDefault && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
                <h3 className="font-medium text-gray-900 mb-1 truncate">{resume.title}</h3>
                {resume.description && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{resume.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>版本 {resume.version}</span>
                  <span>{formatDate(resume.updatedAt)}</span>
                </div>
                {resume.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {resume.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
