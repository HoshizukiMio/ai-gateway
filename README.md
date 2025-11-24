# AI Gateway - 多提供商多格式AI网关服务

基于 Cloudflare Workers 的统一 AI 网关服务，支持多个 AI 提供商（OpenAI、Google Gemini、Anthropic Claude）并提供自动格式转换功能。

## 特性

- ✅ **多提供商支持**: OpenAI、Google Gemini、Anthropic Claude
- ✅ **多格式支持**: 自动转换不同 API 格式
- ✅ **配置驱动**: 通过修改配置文件轻松添加新提供商
- ✅ **无密钥存储**: 使用请求者的 API 密钥，不存储任何凭证
- ✅ **IP 隐藏**: 通过 Cloudflare 代理隐藏请求者 IP
- ✅ **CORS 支持**: 支持浏览器直接调用

## URL 模式

```
/[格式]/[提供商]/[端点]
```

- `[格式]`: 请求格式 (`openai`, `gemini`, `claude`)
- `[提供商]`: 目标提供商 (`openai`, `gemini`, `claude`)
- `[端点]`: API 端点路径

## 使用示例

### 1. OpenAI 格式 → OpenAI 提供商

```bash
curl https://your-gateway.workers.dev/openai/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

### 2. OpenAI 格式 → Gemini 提供商（格式转换）

使用 OpenAI 格式调用 Gemini，网关会自动转换：

```bash
curl https://your-gateway.workers.dev/openai/gemini/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GEMINI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-pro",
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

### 3. Gemini 格式 → Gemini 提供商

```bash
curl https://your-gateway.workers.dev/gemini/gemini/v1beta/generateContent \
  -H "x-api-key: YOUR_GEMINI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [{"text": "你好"}]
      }
    ]
  }'
```

### 4. Claude 格式 → Claude 提供商

```bash
curl https://your-gateway.workers.dev/claude/claude/v1/messages \
  -H "x-api-key: YOUR_CLAUDE_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "messages": [
      {"role": "user", "content": "你好"}
    ],
    "max_tokens": 1024
  }'
```

### 5. OpenAI 格式 → Claude 提供商（格式转换）

```bash
curl https://your-gateway.workers.dev/openai/claude/v1/chat/completions \
  -H "Authorization: Bearer YOUR_CLAUDE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

## 支持的格式转换

网关支持以下格式之间的相互转换：

| 请求格式 | 目标提供商 | 转换 |
|---------|-----------|------|
| OpenAI | OpenAI | 无需转换 |
| OpenAI | Gemini | ✅ 自动转换 |
| OpenAI | Claude | ✅ 自动转换 |
| Gemini | Gemini | 无需转换 |
| Gemini | OpenAI | ✅ 自动转换 |
| Gemini | Claude | ✅ 自动转换 |
| Claude | Claude | 无需转换 |
| Claude | OpenAI | ✅ 自动转换 |
| Claude | Gemini | ✅ 自动转换 |

## API 密钥认证

网关支持多种 API 密钥传递方式：

### OpenAI 风格
```bash
-H "Authorization: Bearer YOUR_API_KEY"
```

### Gemini/Claude 风格
```bash
-H "x-api-key: YOUR_API_KEY"
```

### Gemini 专用
```bash
-H "x-goog-api-key: YOUR_API_KEY"
```

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务将在 `http://localhost:8787` 启动。

### 测试

```bash
npm test
```

## 部署到 Cloudflare Workers

### 首次部署

1. 登录 Cloudflare（如果尚未登录）：
```bash
npx wrangler login
```

2. 部署：
```bash
npm run deploy
```

### 更新部署

```bash
npm run deploy
```

部署后，您的网关将可在以下地址访问：
```
https://ai-gateway.<your-subdomain>.workers.dev
```

## 添加新提供商

要添加新的 AI 提供商，请编辑 `src/config.js`：

```javascript
export const PROVIDERS = {
  // ... 现有提供商 ...
  
  newprovider: {
    name: 'New Provider',
    baseURL: 'https://api.newprovider.com',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    nativeFormat: 'openai', // 或自定义格式
    endpoints: {
      chat: '/v1/chat/completions'
    },
    requiredHeaders: {
      'Content-Type': 'application/json'
    }
  }
};
```

如果提供商使用自定义格式，您还需要在 `src/formats/` 中创建格式转换器。

## 项目结构

```
ai-gateway/
├── src/
│   ├── index.js              # 主入口点
│   ├── config.js             # 提供商配置
│   ├── router.js             # URL 路由和请求验证
│   ├── utils.js              # 工具函数
│   ├── formats/              # 格式转换器
│   │   ├── index.js          # 格式注册表
│   │   ├── openai.js         # OpenAI 格式转换
│   │   ├── gemini.js         # Gemini 格式转换
│   │   └── claude.js         # Claude 格式转换
│   └── providers/            # 提供商适配器
│       ├── index.js          # 提供商注册表
│       ├── openai.js         # OpenAI 适配器
│       ├── gemini.js         # Gemini 适配器
│       └── claude.js         # Claude 适配器
├── test/                     # 测试文件
├── wrangler.jsonc            # Cloudflare Workers 配置
└── package.json
```

## 安全和隐私

- ✅ **无密钥存储**: 网关不存储任何 API 密钥
- ✅ **密钥透传**: API 密钥直接从请求头传递到目标提供商
- ✅ **IP 隐藏**: 通过 Cloudflare Workers 代理，提供商看到的是 Cloudflare 的 IP
- ✅ **无日志**: 默认不记录请求内容（Cloudflare Workers 基础日志除外）

## 限制

- ⚠️ **流式响应**: 当前版本对流式响应的格式转换支持有限
- ⚠️ **速率限制**: 受 Cloudflare Workers 免费套餐限制（每天 100,000 请求）
- ⚠️ **超时**: 请求超时限制为 30 秒（Workers 限制）

## 常见问题

### 如何使用自己的域名？

在 Cloudflare Dashboard 中：
1. 转到 Workers & Pages
2. 选择您的 worker
3. 添加自定义域名

### 支持流式响应吗？

当前版本对流式响应的支持有限。流式请求会直接透传，但不会进行格式转换。

### 如何处理错误？

网关返回标准化的错误响应：
```json
{
  "error": {
    "message": "错误描述",
    "code": "error_code",
    "status": 400
  }
}
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

---

使用愉快！🚀
