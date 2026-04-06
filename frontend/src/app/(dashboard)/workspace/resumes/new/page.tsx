'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { resumeApi } from '@/lib/api/resume';
import { ResumeEditor } from '@/components/resume/resume-editor';
import { Button } from '@/components/ui/button';
import { EMPTY_RESUME_CONTENT } from '@/lib/types/resume';
import type { ResumeContent } from '@/lib/types/resume';

export default function NewResumePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<ResumeContent>(EMPTY_RESUME_CONTENT);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('请输入简历标题');
      return;
    }

    if (!content.basicInfo.name || !content.basicInfo.email || !content.basicInfo.phone) {
      alert('请填写基本必填信息（姓名、邮箱、电话）');
      return;
    }

    try {
      setSaving(true);
      await resumeApi.create({
        title,
        content,
        isDefault: false,
      });
      router.push('/workspace');
    } catch (error) {
      console.error('保存简历失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

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
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入简历标题"
              className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0"
            />
          </div>
        </div>
      </header>

      {/* 编辑器区域 */}
      <div className="flex-1 overflow-auto">
        <ResumeEditor content={content} onChange={setContent} onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
