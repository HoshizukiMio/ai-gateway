# Example Usage - AI Gateway

This file provides practical examples of using the AI Gateway with different providers and formats.

## Prerequisites

- Gateway running locally: `npm run dev` (http://127.0.0.1:8787)
- OR deployed to Cloudflare Workers
- Valid API keys for the providers you want to use

## Environment Setup (Optional)

For easier testing, set environment variables:

```powershell
# PowerShell
$env:OPENAI_KEY = "sk-..."
$env:GEMINI_KEY = "..."
$env:CLAUDE_KEY = "..."
```

```bash
# Bash
export OPENAI_KEY="sk-..."
export GEMINI_KEY="..."
export CLAUDE_KEY="..."
```

## Examples

### 1. OpenAI → OpenAI (No Conversion)

```powershell
# PowerShell
$headers = @{
    "Authorization" = "Bearer $env:OPENAI_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "gpt-3.5-turbo"
    messages = @(
        @{ role = "user"; content = "What is 2+2?" }
    )
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/openai/v1/chat/completions" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.choices[0].message.content
```

```bash
# Bash/cURL
curl http://127.0.0.1:8787/openai/openai/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "What is 2+2?"}
    ]
  }'
```

### 2. OpenAI → Gemini (Format Conversion)

Send OpenAI-formatted request to Gemini (gateway converts):

```powershell
# PowerShell
$headers = @{
    "Authorization" = "Bearer $env:GEMINI_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "gemini-pro"
    messages = @(
        @{ role = "user"; content = "解释什么是人工智能" }
    )
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/gemini/v1/chat/completions" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.choices[0].message.content
```

```bash
# Bash/cURL
curl http://127.0.0.1:8787/openai/gemini/v1/chat/completions \
  -H "Authorization: Bearer $GEMINI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-pro",
    "messages": [
      {"role": "user", "content": "解释什么是人工智能"}
    ]
  }'
```

### 3. OpenAI → Claude (Format Conversion)

```powershell
# PowerShell
$headers = @{
    "Authorization" = "Bearer $env:CLAUDE_KEY"
    "Content-Type" = "application/json"
}

$body = @{
    model = "claude-3-sonnet-20240229"
    messages = @(
        @{ role = "system"; content = "You are a helpful assistant." },
        @{ role = "user"; content = "Write a haiku about coding" }
    )
    max_tokens = 1024
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/claude/v1/chat/completions" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.choices[0].message.content
```

```bash
# Bash/cURL
curl http://127.0.0.1:8787/openai/claude/v1/chat/completions \
  -H "Authorization: Bearer $CLAUDE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Write a haiku about coding"}
    ],
    "max_tokens": 1024
  }'
```

### 4. Gemini → Gemini (Native Format)

```powershell
# PowerShell
$headers = @{
    "x-api-key" = $env:GEMINI_KEY
    "Content-Type" = "application/json"
}

$body = @{
    contents = @(
        @{
            parts = @(
                @{ text = "介绍一下中国的历史" }
            )
        }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/gemini/gemini/v1beta/generateContent" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.candidates[0].content.parts[0].text
```

```bash
# Bash/cURL
curl http://127.0.0.1:8787/gemini/gemini/v1beta/generateContent \
  -H "x-api-key: $GEMINI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "介绍一下中国的历史"}
        ]
      }
    ]
  }'
```

### 5. Claude → Claude (Native Format)

```powershell
# PowerShell
$headers = @{
    "x-api-key" = $env:CLAUDE_KEY
    "anthropic-version" = "2023-06-01"
    "Content-Type" = "application/json"
}

$body = @{
    model = "claude-3-sonnet-20240229"
    messages = @(
        @{ role = "user"; content = "Explain quantum computing in simple terms" }
    )
    max_tokens = 1024
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/claude/claude/v1/messages" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.content[0].text
```

```bash
# Bash/cURL
curl http://127.0.0.1:8787/claude/claude/v1/messages \
  -H "x-api-key: $CLAUDE_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "messages": [
      {"role": "user", "content": "Explain quantum computing in simple terms"}
    ],
    "max_tokens": 1024
  }'
```

### 6. Gemini → OpenAI (Format Conversion)

Send Gemini-formatted request to OpenAI:

```bash
curl http://127.0.0.1:8787/gemini/openai/v1beta/generateContent \
  -H "Authorization: Bearer $OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "What is the meaning of life?"}
        ]
      }
    ]
  }'
```

### 7. Using with Different Models

```powershell
# GPT-4
$body = @{
    model = "gpt-4"
    messages = @(@{ role = "user"; content = "Hello" })
} | ConvertTo-Json

# Gemini Pro Vision
$body = @{
    model = "gemini-pro-vision"
    messages = @(@{ role = "user"; content = "Describe this image" })
} | ConvertTo-Json

# Claude Opus
$body = @{
    model = "claude-3-opus-20240229"
    messages = @(@{ role = "user"; content = "Complex reasoning task" })
    max_tokens = 2048
} | ConvertTo-Json
```

## Using from JavaScript/Browser

```javascript
async function callGateway() {
  const response = await fetch('http://127.0.0.1:8787/openai/gemini/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_GEMINI_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gemini-pro',
      messages: [
        { role: 'user', content: 'Hello from JavaScript!' }
      ]
    })
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}
```

## Using from Python

```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

body = {
    'model': 'gpt-3.5-turbo',
    'messages': [
        {'role': 'user', 'content': 'Hello from Python!'}
    ]
}

response = requests.post(
    'http://127.0.0.1:8787/openai/openai/v1/chat/completions',
    headers=headers,
    json=body
)

print(response.json()['choices'][0]['message']['content'])
```

## Error Handling

```javascript
async function callWithErrorHandling() {
  try {
    const response = await fetch('http://127.0.0.1:8787/openai/gemini/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemini-pro',
        messages: [{ role: 'user', content: 'Hello!' }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error:', error.error.message);
      return;
    }

    const data = await response.json();
    console.log(data.choices[0].message.content);
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

## Streaming (Experimental)

Note: Streaming currently passes through without format conversion.

```bash
curl http://127.0.0.1:8787/openai/openai/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Tell me a story"}],
    "stream": true
  }'
```

## Testing Without Real API Keys

For testing the gateway routing and format conversion logic (without making actual API calls):

```powershell
# This will fail at the provider level but confirms routing works
$headers = @{
    "Authorization" = "Bearer test-key-123"
    "Content-Type" = "application/json"
}

$body = @{
    model = "gpt-3.5-turbo"
    messages = @(@{ role = "user"; content = "Test" })
} | ConvertTo-Json

# Should return a provider error (not a routing error)
Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/gemini/v1/chat/completions" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

## Deployment to Production

After deploying with `npm run deploy`, use your production URL:

```bash
# Replace with your actual worker URL
GATEWAY_URL="https://ai-gateway.your-subdomain.workers.dev"

curl $GATEWAY_URL/openai/gemini/v1/chat/completions \
  -H "Authorization: Bearer $GEMINI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-pro","messages":[{"role":"user","content":"Hello"}]}'
```

## Tips

1. **API Key Security**: Never hardcode API keys. Use environment variables or secure secret management.

2. **Rate Limiting**: Be aware of rate limits from both Cloudflare Workers and the target AI providers.

3. **Model Availability**: Not all models support all features. Check provider documentation.

4. **Cost Management**: Each request goes to the actual provider and incurs costs according to their pricing.

5. **Error Messages**: Check the error response for detailed information about what went wrong.

---

For more information, see [README.md](README.md) and [CONFIG_GUIDE.md](CONFIG_GUIDE.md).
