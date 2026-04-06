"""
JD解析路由
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.services.openai_service import openai_service

router = APIRouter()


class JDAnalysisRequest(BaseModel):
    """JD解析请求"""
    jd_text: str
    options: Optional[Dict[str, Any]] = None


class StructuredJD(BaseModel):
    """结构化JD数据"""
    jobTitle: str
    company: Optional[str] = None
    location: Optional[str] = None
    salaryRange: Optional[Dict[str, Any]] = None
    requirements: Optional[Dict[str, Any]] = None
    responsibilities: List[str] = []
    preferredQualifications: List[str] = []


class JDAnalysisResponse(BaseModel):
    """JD解析响应"""
    structured: StructuredJD
    keywords: List[str]
    summary: str


@router.post("/analyze", response_model=JDAnalysisResponse)
async def analyze_jd(request: JDAnalysisRequest):
    """
    解析职位描述，提取关键信息
    """
    prompt = f"""请分析以下职位描述，提取结构化信息。

职位描述：
{request.jd_text}

请以JSON格式返回以下信息：
1. structured: 结构化的职位信息
   - jobTitle: 职位名称
   - company: 公司名称（如果有）
   - location: 工作地点（如果有）
   - salaryRange: 薪资范围（如果有）{{min, max, currency}}
   - requirements: 职位要求
     - skills: 技能要求列表
     - experience: 经验要求 {{years, level}}
     - education: 学历要求列表
     - certifications: 证书要求列表
   - responsibilities: 工作职责列表
   - preferredQualifications: 优先条件列表
2. keywords: 关键词列表（技能、工具等）
3. summary: 职位摘要（一句话概括）

请确保返回有效的JSON格式。"""

    try:
        result = await openai_service.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        data = await openai_service.parse_json_response(result)
        return JDAnalysisResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JD解析失败: {str(e)}")
