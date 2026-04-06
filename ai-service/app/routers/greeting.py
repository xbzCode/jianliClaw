"""
打招呼语生成路由
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.services.openai_service import openai_service

router = APIRouter()


class GreetingRequest(BaseModel):
    """打招呼语生成请求"""
    recipient_name: str
    platform: str  # boss, linkedin, email
    job_title: str
    company: str
    tone: Optional[str] = "professional"  # professional, friendly, enthusiastic
    include_self_intro: Optional[bool] = True


class GreetingResponse(BaseModel):
    """打招呼语生成响应"""
    greetings: List[str]
    tips: str


@router.post("/generate", response_model=GreetingResponse)
async def generate_greeting(request: GreetingRequest):
    """
    生成打招呼语
    """
    platform_context = {
        "boss": "BOSS直聘",
        "linkedin": "LinkedIn",
        "email": "邮件",
    }

    platform_name = platform_context.get(request.platform, request.platform)

    prompt = f"""请生成专业的打招呼语。

目标信息：
- 对方称呼：{request.recipient_name}
- 平台：{platform_name}
- 目标职位：{request.job_title}
- 公司：{request.company}
- 风格：{request.tone}
- 是否包含自我介绍：{"是" if request.include_self_intro else "否"}

请以JSON格式返回以下信息：
1. greetings: 3个不同版本的打招呼语（数组）
2. tips: 使用建议（一句话）

风格说明：
- professional: 专业、正式
- friendly: 友好、亲切
- enthusiastic: 热情、积极

请确保返回有效的JSON格式。"""

    try:
        result = await openai_service.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.8,
        )
        data = await openai_service.parse_json_response(result)
        return GreetingResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"打招呼语生成失败: {str(e)}")
