"""
AI服务 - FastAPI应用入口
提供JD解析、简历优化、打招呼语生成等AI能力
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn

from app.routers import jd, resume, greeting
from app.config import settings

# 加载环境变量
load_dotenv()

# 创建FastAPI应用
app = FastAPI(
    title="简历智伴 - AI服务",
    description="提供JD解析、简历优化、打招呼语生成等AI能力",
    version="1.0.0",
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制来源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(jd.router, prefix="/api/v1/jd", tags=["JD解析"])
app.include_router(resume.router, prefix="/api/v1/resume", tags=["简历优化"])
app.include_router(greeting.router, prefix="/api/v1/greeting", tags=["打招呼语生成"])


@app.get("/")
async def root():
    """健康检查"""
    return {"status": "ok", "service": "AI Service", "version": "1.0.0"}


@app.get("/health")
async def health():
    """健康检查端点"""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
