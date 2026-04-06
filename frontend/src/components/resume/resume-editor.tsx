'use client';

import { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ResumeContent, WorkExperience, Education, Project, SkillCategory } from '@/lib/types/resume';

interface ResumeEditorProps {
  content: ResumeContent;
  onChange: (content: ResumeContent) => void;
  onSave: () => void;
  saving?: boolean;
}

export function ResumeEditor({ content, onChange, onSave, saving }: ResumeEditorProps) {
  const updateBasicInfo = (field: string, value: string) => {
    onChange({
      ...content,
      basicInfo: { ...content.basicInfo, [field]: value },
    });
  };

  // 工作经历操作
  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
      skills: [],
    };
    onChange({
      ...content,
      workExperience: [...content.workExperience, newExp],
    });
  };

  const updateWorkExperience = (index: number, field: string, value: any) => {
    const updated = [...content.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, workExperience: updated });
  };

  const removeWorkExperience = (index: number) => {
    const updated = content.workExperience.filter((_, i) => i !== index);
    onChange({ ...content, workExperience: updated });
  };

  // 教育经历操作
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      major: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    onChange({
      ...content,
      education: [...content.education, newEdu],
    });
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...content.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, education: updated });
  };

  const removeEducation = (index: number) => {
    const updated = content.education.filter((_, i) => i !== index);
    onChange({ ...content, education: updated });
  };

  // 项目经历操作
  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: '',
      role: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      link: '',
    };
    onChange({
      ...content,
      projects: [...content.projects, newProj],
    });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...content.projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, projects: updated });
  };

  const removeProject = (index: number) => {
    const updated = content.projects.filter((_, i) => i !== index);
    onChange({ ...content, projects: updated });
  };

  // 技能操作
  const addSkillCategory = () => {
    const newSkill: SkillCategory = {
      category: '',
      items: [],
    };
    onChange({
      ...content,
      skills: [...content.skills, newSkill],
    });
  };

  const updateSkillCategory = (index: number, field: string, value: any) => {
    const updated = [...content.skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...content, skills: updated });
  };

  const removeSkillCategory = (index: number) => {
    const updated = content.skills.filter((_, i) => i !== index);
    onChange({ ...content, skills: updated });
  };

  return (
    <div className="p-6 space-y-8">
      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? '保存中...' : '保存简历'}
        </Button>
      </div>

      {/* 基本信息 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <Input
              value={content.basicInfo.name}
              onChange={(e) => updateBasicInfo('name', e.target.value)}
              placeholder="请输入姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
            <Input
              type="email"
              value={content.basicInfo.email}
              onChange={(e) => updateBasicInfo('email', e.target.value)}
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">电话 *</label>
            <Input
              value={content.basicInfo.phone}
              onChange={(e) => updateBasicInfo('phone', e.target.value)}
              placeholder="请输入电话"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
            <Input
              value={content.basicInfo.location || ''}
              onChange={(e) => updateBasicInfo('location', e.target.value)}
              placeholder="请输入所在城市"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">作品集</label>
            <Input
              value={content.basicInfo.portfolio || ''}
              onChange={(e) => updateBasicInfo('portfolio', e.target.value)}
              placeholder="作品集链接"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <Input
              value={content.basicInfo.linkedin || ''}
              onChange={(e) => updateBasicInfo('linkedin', e.target.value)}
              placeholder="LinkedIn链接"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <Input
              value={content.basicInfo.github || ''}
              onChange={(e) => updateBasicInfo('github', e.target.value)}
              placeholder="GitHub链接"
            />
          </div>
        </div>
      </section>

      {/* 工作经历 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">工作经历</h2>
          <Button variant="outline" size="sm" onClick={addWorkExperience}>
            <Plus className="w-4 h-4 mr-1" />
            添加工作经历
          </Button>
        </div>
        <div className="space-y-4">
          {content.workExperience.map((exp, index) => (
            <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="font-medium">工作经历 {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeWorkExperience(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">公司名称</label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">职位</label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">开始日期</label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">结束日期</label>
                  <Input
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                    placeholder="至今"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">工作描述</label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 教育经历 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">教育经历</h2>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="w-4 h-4 mr-1" />
            添加教育经历
          </Button>
        </div>
        <div className="space-y-4">
          {content.education.map((edu, index) => (
            <div key={edu.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="font-medium">教育经历 {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">学校名称</label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">学位</label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="本科/硕士/博士"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">专业</label>
                  <Input
                    value={edu.major || ''}
                    onChange={(e) => updateEducation(index, 'major', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">GPA</label>
                  <Input
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 技能 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">专业技能</h2>
          <Button variant="outline" size="sm" onClick={addSkillCategory}>
            <Plus className="w-4 h-4 mr-1" />
            添加技能分类
          </Button>
        </div>
        <div className="space-y-4">
          {content.skills.map((skill, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="font-medium">技能分类 {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeSkillCategory(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">分类名称</label>
                  <Input
                    value={skill.category}
                    onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                    placeholder="如：编程语言、框架、工具等"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">技能列表（逗号分隔）</label>
                  <Input
                    value={skill.items.join(', ')}
                    onChange={(e) =>
                      updateSkillCategory(
                        index,
                        'items',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    placeholder="如：JavaScript, TypeScript, Python"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 项目经历 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">项目经历</h2>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="w-4 h-4 mr-1" />
            添加项目经历
          </Button>
        </div>
        <div className="space-y-4">
          {content.projects.map((proj, index) => (
            <div key={proj.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="font-medium">项目经历 {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeProject(index)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">项目名称</label>
                  <Input
                    value={proj.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">角色</label>
                  <Input
                    value={proj.role}
                    onChange={(e) => updateProject(index, 'role', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">项目描述</label>
                  <Textarea
                    value={proj.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">使用技术（逗号分隔）</label>
                  <Input
                    value={proj.technologies.join(', ')}
                    onChange={(e) =>
                      updateProject(
                        index,
                        'technologies',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">项目链接</label>
                  <Input
                    value={proj.link || ''}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
