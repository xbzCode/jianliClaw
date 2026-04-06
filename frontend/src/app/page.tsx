import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Target, Sparkles, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* 导航栏 */}
      <nav className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold">简历智伴</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">登录</Button>
              </Link>
              <Link href="/register">
                <Button>立即开始</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI驱动的简历优化助手
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            解析职位描述，智能匹配简历，生成高匹配度简历内容与沟通话术，让求职更高效
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6">
              免费开始使用
            </Button>
          </Link>
        </div>
      </section>

      {/* 功能特点 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>职位解析</CardTitle>
              <CardDescription>
                智能解析职位描述，提取关键要求和技能点
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>简历管理</CardTitle>
              <CardDescription>
                在线编辑简历，支持多版本管理和模板切换
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>匹配分析</CardTitle>
              <CardDescription>
                智能分析简历与职位匹配度，提供优化建议
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>话术生成</CardTitle>
              <CardDescription>
                生成专业打招呼语，提升投递回复率
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-3xl font-bold text-center mb-12">使用流程</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">上传简历</h3>
            <p className="text-gray-600 dark:text-gray-400">
              上传PDF/Word简历或在线编辑简历内容
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">解析职位</h3>
            <p className="text-gray-600 dark:text-gray-400">
              粘贴职位描述，AI自动提取关键要求
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">优化投递</h3>
            <p className="text-gray-600 dark:text-gray-400">
              查看匹配度分析，优化简历内容，生成话术
            </p>
          </div>
        </div>
      </section>

      {/* 底部CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">开始优化您的简历</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          加入我们，让AI助力您的求职之路
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8 py-6">
            立即注册
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 简历智伴. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
