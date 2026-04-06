"""
OpenAI服务封装
"""
from openai import OpenAI
from typing import List, Dict, Any, Optional
import json

from app.config import settings


class OpenAIService:
    """OpenAI服务类"""

    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
        )
        self.default_model = settings.DEFAULT_MODEL
        self.fallback_model = settings.FALLBACK_MODEL

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
        response_format: Optional[Dict[str, str]] = None,
    ) -> str:
        """
        聊天补全接口

        Args:
            messages: 消息列表
            model: 模型名称
            temperature: 温度参数
            max_tokens: 最大token数
            response_format: 响应格式（如 {"type": "json_object"}）

        Returns:
            模型生成的文本
        """
        try:
            kwargs = {
                "model": model or self.default_model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            if response_format:
                kwargs["response_format"] = response_format

            response = self.client.chat.completions.create(**kwargs)
            return response.choices[0].message.content or ""
        except Exception as e:
            # 使用fallback模型重试
            if model is None:
                kwargs["model"] = self.fallback_model
                response = self.client.chat.completions.create(**kwargs)
                return response.choices[0].message.content or ""
            raise e

    async def get_embedding(self, text: str) -> List[float]:
        """
        获取文本的向量表示

        Args:
            text: 输入文本

        Returns:
            向量表示
        """
        response = self.client.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=text,
        )
        return response.data[0].embedding

    async def parse_json_response(self, text: str) -> Dict[str, Any]:
        """
        解析JSON响应

        Args:
            text: JSON文本

        Returns:
            解析后的字典
        """
        try:
            # 尝试直接解析
            return json.loads(text)
        except json.JSONDecodeError:
            # 尝试提取JSON块
            if "```json" in text:
                json_str = text.split("```json")[1].split("```")[0].strip()
                return json.loads(json_str)
            elif "```" in text:
                json_str = text.split("```")[1].split("```")[0].strip()
                return json.loads(json_str)
            raise ValueError(f"无法解析JSON响应: {text}")


# 全局实例
openai_service = OpenAIService()
