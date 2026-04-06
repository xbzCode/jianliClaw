"""
简历优化路由
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.services.openai_service import openai_service

router = APIRouter()


class MatchAnalysisRequest(BaseModel):
    """匹配度分析请求"""
    resume_content: Dict[str, Any]
    jd_text: str
    jd_structured: Optional[Dict[str, Any]] = None


class MatchAnalysisResponse(BaseModel):
    """匹配度分析响应"""
    overallScore: float
    breakdown: Dict[str, Any]
    improvementSuggestions: List[str]
    optimizedSections: Optional[Dict[str, Any]] = None


class ResumeOptimizeRequest(BaseModel):
    """简历优化请求"""
    resume_content: Dict[str, Any]
    jd_text: str
    focus_areas: Optional[List[str]] = None
    tone: Optional[str] = "professional"


class ResumeOptimizeResponse(BaseModel):
    """简历优化响应"""
    optimizedContent: Dict[str, Any]
    changes: Dict[str, Any]
    reasoning: str


@router.post("/match", response_model=MatchAnalysisResponse)
async def analyze_match(request: MatchAnalysisRequest):
    """
    分析简历与JD的匹配度
    """
    resume_str = str(request.resume_content)

    prompt = f"""请分析简历与职位描述的匹配度。

简历内容：
{resume_str}

职位描述：
{request.jd_text}

请以JSON格式返回以下信息：
1. overallScore: 整体匹配度分数（0-100）
2. breakdown: 分项分析
   - skills: 技能匹配 {{score, matched, missing, suggestions}}
   - experience: 经验匹配 {{score, alignment, gapAnalysis}}
   - education: 学历匹配 {{score, matched, suggestions}}
3. improvementSuggestions: 改进建议列表
4. optimizedSections: 优化后的简历段落示例（可选）
   - summary: 个人简介
   - workExperience: 工作经历亮点

请确保返回有效的JSON格式。"""

    try:
        result = await openai_service.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.5,
        )
        data = await openai_service.parse_json_response(result)
        return MatchAnalysisResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"匹配度分析失败: {str(e)}")


@router.post("/optimize", response_model=ResumeOptimizeResponse)
async def optimize_resume(request: ResumeOptimizeRequest):
    """
    优化简历内容
    """
    resume_str = str(request.resume_content)

    focus_text = ""
    if request.focus_areas:
        focus_text = f"\n重点关注领域：{', '.join(request.focus_areas)}"

    prompt = f"""请根据职位描述优化简历内容。

简历内容：
{resume_str}

职位描述：
{request.jd_text}
{focus_text}

风格要求：{request.tone or 'professional'}（professional/concise/achievement-oriented）

请以JSON格式返回以下信息：
1. optimizedContent: 优化后的简历内容（保持原有结构）
2. changes: 变更说明
   - summary: 总体变更说明
   - workExperience: 工作经历变更点
   - skills: 技能变更点
3. reasoning: 优化理由说明

请确保返回有效的JSON格式。"""

    try:
        result = await openai_service.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=3000,
        )
        data = await openai_service.parse_json_response(result)
        return ResumeOptimizeResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"简历优化失败: {str(e)}")
