# 新增提供商说明

AI Gateway 现已支持 **11 个 AI 提供商**!

## 国际提供商

### 1. OpenAI
- **模型**: GPT-3.5, GPT-4, GPT-4 Turbo
- **格式**: OpenAI 原生
- **API密钥**: `Authorization: Bearer sk-...`

### 2. Google Gemini
- **模型**: Gemini Pro, Gemini Pro Vision
- **格式**: Gemini 原生
- **API密钥**: `x-api-key: ...`

### 3. Anthropic Claude
- **模型**: Claude 3 Sonnet, Opus, Haiku
- **格式**: Claude 原生
- **API密钥**: `x-api-key: ...`

### 4. Mistral AI
- **模型**: Mistral Medium, Small, Tiny
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`

### 5. Cohere
- **模型**: Command, Command-Light
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`

### 6. DeepSeek
- **模型**: DeepSeek Chat, DeepSeek Coder
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`

### 7. Groq
- **模型**: Llama2, Mixtral (超高速推理)
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`

### 8. Perplexity AI
- **模型**: Llama 3.1 Sonar (联网搜索)
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`

## 国内提供商

### 9. 阿里云通义千问 (Qwen)
- **模型**: Qwen-Turbo, Qwen-Plus, Qwen-Max
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`
- **文档**: https://help.aliyun.com/dashscope/

### 10. 智谱AI (ChatGLM)
- **模型**: GLM-4, GLM-3-Turbo
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`
- **文档**: https://open.bigmodel.cn/

### 11. 百度文心一言 (ERNIE)
- **模型**: ERNIE-Bot-Turbo, ERNIE-Bot-4
- **格式**: OpenAI 兼容
- **API密钥**: `Authorization: Bearer ...`
- **文档**: https://cloud.baidu.com/doc/WENXINWORKSHOP/

## 使用示例

### 使用 Mistral AI

```bash
curl http://127.0.0.1:8787/openai/mistral/v1/chat/completions \
  -H "Authorization: Bearer YOUR_MISTRAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-medium",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 使用通义千问 (Qwen)

```bash
curl http://127.0.0.1:8787/openai/qwen/v1/chat/completions \
  -H "Authorization: Bearer YOUR_QWEN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-turbo",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### 使用 ChatGLM

```bash
curl http://127.0.0.1:8787/openai/glm/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GLM_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### 使用 Groq (超高速)

```bash
curl http://127.0.0.1:8787/openai/groq/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2-70b-4096",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 使用 Perplexity (联网搜索)

```bash
curl http://127.0.0.1:8787/openai/perplexity/v1/chat/completions \
  -H "Authorization: Bearer YOUR_PERPLEXITY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-sonar-small-128k-online",
    "messages": [{"role": "user", "content": "Latest news about AI"}]
  }'
```

## PowerShell 示例

```powershell
# Mistral AI
$headers = @{
    "Authorization" = "Bearer $env:MISTRAL_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "mistral-medium"
    messages = @(@{ role = "user"; content = "Hello from Mistral!" })
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/mistral/v1/chat/completions" `
    -Method POST -Headers $headers -Body $body

$response.choices[0].message.content
```

```powershell
# 通义千问
$headers = @{
    "Authorization" = "Bearer $env:QWEN_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "qwen-turbo"
    messages = @(@{ role = "user"; content = "你好，通义千问！" })
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/qwen/v1/chat/completions" `
    -Method POST -Headers $headers -Body $body

$response.choices[0].message.content
```

## 格式转换

所有新增的提供商都支持 OpenAI 格式,可以与其他格式互相转换:

```bash
# 使用 Gemini 格式调用 Mistral
curl http://127.0.0.1:8787/gemini/mistral/v1beta/generateContent \
  -H "Authorization: Bearer YOUR_MISTRAL_KEY" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'

# 使用 OpenAI 格式调用通义千问
curl http://127.0.0.1:8787/openai/qwen/v1/chat/completions \
  -H "Authorization: Bearer YOUR_QWEN_KEY" \
  -d '{"model":"qwen-turbo","messages":[{"role":"user","content":"你好"}]}'
```

## 提供商对比

| 提供商 | 优势 | 适用场景 |
|-------|------|---------|
| OpenAI | 最强大的模型 | 复杂任务、创意写作 |
| Gemini | 多模态、性价比高 | 图像理解、长文本 |
| Claude | 安全可控、长上下文 | 企业应用、分析 |
| Mistral | 开源友好、欧盟合规 | 欧洲市场 |
| Cohere | 企业级、多语言 | 搜索、分类 |
| DeepSeek | 性价比极高 | 代码生成、推理 |
| Groq | 超高速推理 | 实时应用 |
| Perplexity | 联网搜索 | 实时信息查询 |
| 通义千问 | 中文优化、阿里生态 | 中国市场、电商 |
| ChatGLM | 本土化好、免费额度 | 初创企业、测试 |
| 文心一言 | 百度生态、行业模型 | 百度服务集成 |

## 获取 API 密钥

- **OpenAI**: https://platform.openai.com/api-keys
- **Gemini**: https://makersuite.google.com/app/apikey
- **Claude**: https://console.anthropic.com/
- **Mistral**: https://console.mistral.ai/
- **Cohere**: https://dashboard.cohere.com/api-keys
- **DeepSeek**: https://platform.deepseek.com/
- **Groq**: https://console.groq.com/
- **Perplexity**: https://www.perplexity.ai/settings/api
- **通义千问**: https://dashscope.console.aliyun.com/
- **ChatGLM**: https://open.bigmodel.cn/
- **文心一言**: https://console.bce.baidu.com/qianfan/

---

更新时间: 2024-11-24
