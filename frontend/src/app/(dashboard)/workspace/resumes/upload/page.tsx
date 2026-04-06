'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, X } from 'lucide-react';
import Link from 'next/link';
import { resumeApi } from '@/lib/api/resume';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function UploadResumePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('仅支持 PDF 和 DOCX 格式的文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB');
      return;
    }

    setFile(file);
    // 默认使用文件名作为标题
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('请选择要上传的文件');
      return;
    }

    try {
      setUploading(true);
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t);

      const result = await resumeApi.upload(file, title || undefined, tagList.length > 0 ? tagList : undefined);

      // 跳转到编辑页面
      router.push(`/workspace/resumes/${result.resume.id}`);
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* 顶部导航 */}
      <div className="mb-6">
        <Link href="/workspace">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">上传简历文件</h1>

      {/* 文件上传区域 */}
      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          {file ? (
            <div className="space-y-4">
              <FileText className="w-16 h-16 mx-auto text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                <X className="w-4 h-4 mr-2" />
                移除文件
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 mx-auto text-gray-400" />
              <div>
                <p className="text-gray-600 mb-2">拖拽文件到此处，或点击选择文件</p>
                <p className="text-sm text-gray-400">支持 PDF、DOCX 格式，最大 10MB</p>
              </div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>选择文件</span>
                </Button>
              </label>
            </div>
          )}
        </div>
      </Card>

      {/* 表单信息 */}
      {file && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">简历标题</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入简历标题"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标签（可选）</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="用逗号分隔多个标签，如：前端开发,React"
            />
          </div>
          <div className="pt-4">
            <Button onClick={handleUpload} disabled={uploading} className="w-full">
              {uploading ? '上传中...' : '上传简历'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
