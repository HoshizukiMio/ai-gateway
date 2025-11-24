# 快速开始指南

## 🚀 5分钟上手 AI 网关

### 1. 启动开发服务器

```bash
npm run dev
```

服务将在 `http://127.0.0.1:8787` 启动。

### 2. 测试基本功能

运行测试脚本验证网关正常工作：

```powershell
powershell -ExecutionPolicy Bypass -File test-gateway.ps1
```

### 3. 使用真实 API 密钥测试

#### 测试 OpenAI（无格式转换）

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_OPENAI_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "gpt-3.5-turbo"
    messages = @(
        @{ role = "user"; content = "你好" }
    )
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/openai/v1/chat/completions" `
    -Method POST -Headers $headers -Body $body

Write-Host $response.choices[0].message.content
```

#### 测试格式转换（OpenAI → Gemini）

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_GEMINI_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "gemini-pro"
    messages = @(
        @{ role = "user"; content = "解释什么是人工智能" }
    )
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/gemini/v1/chat/completions" `
    -Method POST -Headers $headers -Body $body

Write-Host $response.choices[0].message.content
```

### 4. 部署到生产环境

#### 首次部署

```bash
# 登录 Cloudflare（如果还没登录）
npx wrangler login

# 部署
npm run deploy
```

#### 获取部署 URL

部署成功后，会显示你的网关地址：
```
https://ai-gateway.<your-subdomain>.workers.dev
```

#### 使用生产 URL

```bash
curl https://ai-gateway.<your-subdomain>.workers.dev/openai/gemini/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GEMINI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-pro",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

## 📖 核心概念

### URL 模式

```
/[格式]/[提供商]/[端点]
```

- **格式**: 请求使用的格式 (`openai`, `gemini`, `claude`)
- **提供商**: 要调用的目标提供商 (`openai`, `gemini`, `claude`)
- **端点**: API 端点路径

### 示例场景

| 场景 | URL | 说明 |
|-----|-----|-----|
| 直接调用 OpenAI | `/openai/openai/v1/chat/completions` | 无转换 |
| 用 OpenAI 格式调用 Gemini | `/openai/gemini/v1/chat/completions` | 自动转换 |
| 用 OpenAI 格式调用 Claude | `/openai/claude/v1/chat/completions` | 自动转换 |
| 直接调用 Gemini | `/gemini/gemini/v1beta/generateContent` | 无转换 |
| 直接调用 Claude | `/claude/claude/v1/messages` | 无转换 |

### API 密钥传递方式

网关支持多种密钥传递方式：

```bash
# OpenAI 风格
-H "Authorization: Bearer YOUR_API_KEY"

# Gemini/Claude 风格
-H "x-api-key: YOUR_API_KEY"

# Gemini 专用
-H "x-goog-api-key: YOUR_API_KEY"
```

## 🔧 常见使用场景

### 场景 1: 统一接口访问多个提供商

使用相同的 OpenAI 格式代码，通过修改 URL 切换提供商：

```javascript
// 只需要修改 URL，代码完全相同
const providers = [
  'http://gateway/openai/openai/v1/chat/completions',   // OpenAI
  'http://gateway/openai/gemini/v1/chat/completions',   // Gemini
  'http://gateway/openai/claude/v1/chat/completions'    // Claude
];

for (const url of providers) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'model-name',
      messages: [{ role: 'user', content: 'Hello' }]
    })
  });
}
```

### 场景 2: 隐藏真实 IP

当你需要保护用户隐私或避免 IP 被封时，通过网关代理：

```
用户 → AI 网关（Cloudflare IP） → AI 提供商
```

提供商只能看到 Cloudflare 的 IP，无法追踪真实用户。

### 场景 3: A/B 测试不同提供商

轻松测试不同 AI 提供商的响应质量：

```powershell
# 测试同一问题在不同提供商的表现
$question = @{ role = "user"; content = "解释量子计算" }

# OpenAI
$responseA = Invoke-RestMethod -Uri "$gateway/openai/openai/v1/chat/completions" ...

# Gemini
$responseB = Invoke-RestMethod -Uri "$gateway/openai/gemini/v1/chat/completions" ...

# Claude
$responseC = Invoke-RestMethod -Uri "$gateway/openai/claude/v1/chat/completions" ...
```

## 🎯 下一步

- 📚 查看 [EXAMPLES.md](EXAMPLES.md) 获取更多示例
- ⚙️ 阅读 [CONFIG_GUIDE.md](CONFIG_GUIDE.md) 学习如何添加新提供商
- 📖 参考 [README.md](README.md) 了解完整功能

## ⚠️ 注意事项

1. **API 密钥安全**: 不要在代码中硬编码密钥，使用环境变量
2. **费用**: 每次调用都会产生目标提供商的费用
3. **速率限制**: 注意 Cloudflare Workers 和各提供商的速率限制
4. **流式响应**: 当前版本流式响应支持有限

## 💡 提示

- 开发时使用 `npm run dev`，部署用 `npm run deploy`
- 使用 `test-gateway.ps1` 验证路由是否正常工作
- 查看浏览器控制台或 wrangler 日志排查问题
- Cloudflare Workers 免费套餐每天 100,000 请求

---

祝使用愉快！🎉
