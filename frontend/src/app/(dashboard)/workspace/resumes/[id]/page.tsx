'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Star, History } from 'lucide-react';
import Link from 'next/link';
import { resumeApi } from '@/lib/api/resume';
import { ResumeEditor } from '@/components/resume/resume-editor';
import { Button } from '@/components/ui/button';
import type { Resume, ResumeContent } from '@/lib/types/resume';

export default function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) {
      loadResume();
    }
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const data = await resumeApi.get(id);
      setResume(data);
      setContent(data.content);
    } catch (error) {
      console.error('加载简历失败:', error);
      alert('加载简历失败');
      router.push('/workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content || !resume) return;

    try {
      setSaving(true);
      await resumeApi.update(resume.id, { content });
      // 重新加载获取最新数据
      await loadResume();
      alert('保存成功');
    } catch (error) {
      console.error('保存简历失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async () => {
    if (!resume) return;
    try {
      await resumeApi.setDefault(resume.id);
      await loadResume();
    } catch (error) {
      console.error('设置默认简历失败:', error);
    }
  };

  const handleDownload = async () => {
    if (!resume) return;
    try {
      const url = await resumeApi.getFileUrl(resume.id);
      window.open(url, '_blank');
    } catch (error) {
      console.error('获取下载链接失败:', error);
    }
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部工具栏 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/workspace">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{resume.title}</h1>
            <p className="text-sm text-gray-500">
              版本 {resume.version} · 更新于 {new Date(resume.updatedAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!resume.isDefault && (
            <Button variant="outline" size="sm" onClick={handleSetDefault}>
              <Star className="w-4 h-4 mr-2" />
              设为默认
            </Button>
          )}
          {resume.fileUrl && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              下载原文件
            </Button>
          )}
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            版本历史
          </Button>
        </div>
      </header>

      {/* 编辑器区域 */}
      <div className="flex-1 overflow-auto">
        <ResumeEditor content={content} onChange={setContent} onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
