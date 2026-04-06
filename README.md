# 简历智伴

AI驱动的简历优化助手，通过解析职位描述，帮助用户生成高匹配度的简历内容与沟通话术，提升求职效率。

## 项目结构

```
jianliclaw/
├── backend/          # NestJS后端服务
├── frontend/         # Next.js前端应用
├── ai-service/       # Python FastAPI AI服务
├── spec/             # 项目规格文档
├── docker/           # Docker配置
└── docker-compose.yml
```

## 技术栈

### 后端
- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- Redis (会话缓存)
- MinIO (文件存储)
- JWT认证

### 前端
- Next.js 14 + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (状态管理)
- React Hook Form + Zod (表单验证)

### AI服务
- FastAPI + Python
- OpenAI API

## 快速开始

### 前置要求
- Node.js 20+
- Python 3.10+
- Docker & Docker Compose

### 1. 安装依赖

```bash
# 安装所有工作空间依赖
npm install
```

### 2. 启动基础设施服务

```bash
# 启动 PostgreSQL, Redis, MinIO
docker-compose up -d
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example backend/.env
cp ai-service/.env.example ai-service/.env

# 编辑环境变量，填入实际配置
# 特别是 OPENAI_API_KEY 和 JWT_SECRET
```

### 4. 初始化数据库

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5. 启动服务

```bash
# 终端1: 启动后端
cd backend
npm run start:dev

# 终端2: 启动前端
cd frontend
npm run dev

# 终端3: 启动AI服务
cd ai-service
pip install -r requirements.txt
python main.py
```

### 访问地址

- 前端: http://localhost:3000
- 后端API: http://localhost:3001/api/v1
- AI服务: http://localhost:8000
- MinIO控制台: http://localhost:9001

## 核心功能

### Phase 1 (MVP) - 当前阶段
- [x] 用户注册/登录
- [x] 基础架构搭建
- [ ] 简历管理
- [ ] JD解析
- [ ] 匹配度分析
- [ ] 打招呼语生成

### Phase 2 - 能力增强
- 智能路由
- 技能编排
- 异步处理

### Phase 3 - 高级能力
- 复杂任务规划
- 自动评估
- 多场景配置

## API文档

启动后端服务后访问: http://localhost:3001/api

## 开发指南

### 数据库迁移

```bash
cd backend
npx prisma migrate dev --name <migration_name>
```

### 生成Prisma客户端

```bash
cd backend
npx prisma generate
```

### 添加shadcn/ui组件

```bash
cd frontend
npx shadcn@latest add <component_name>
```

## 许可证

MIT License
