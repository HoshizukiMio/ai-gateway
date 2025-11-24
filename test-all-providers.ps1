# AI Gateway Provider Testing Script
# Tests all 11 supported providers

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "AI Gateway Provider Testing" -ForegroundColor Cyan
Write-Host "Testing All 11 Providers" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$GATEWAY_URL = "http://127.0.0.1:8787"

# Define test providers with their configurations
$providers = @{
    "OpenAI" = @{
        key = $env:OPENAI_KEY
        url = "$GATEWAY_URL/openai/openai/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "gpt-3.5-turbo"
    }
    "Gemini" = @{
        key = $env:GEMINI_KEY
        url = "$GATEWAY_URL/openai/gemini/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "gemini-pro"
    }
    "Claude" = @{
        key = $env:CLAUDE_KEY
        url = "$GATEWAY_URL/openai/claude/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "claude-3-sonnet-20240229"
    }
    "Mistral" = @{
        key = $env:MISTRAL_KEY
        url = "$GATEWAY_URL/openai/mistral/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "mistral-medium"
    }
    "Cohere" = @{
        key = $env:COHERE_KEY
        url = "$GATEWAY_URL/openai/cohere/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "command"
    }
    "DeepSeek" = @{
        key = $env:DEEPSEEK_KEY
        url = "$GATEWAY_URL/openai/deepseek/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "deepseek-chat"
    }
    "Qwen" = @{
        key = $env:QWEN_KEY
        url = "$GATEWAY_URL/openai/qwen/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "qwen-turbo"
    }
    "ChatGLM" = @{
        key = $env:GLM_KEY
        url = "$GATEWAY_URL/openai/glm/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "glm-4"
    }
    "ERNIE" = @{
        key = $env:ERNIE_KEY
        url = "$GATEWAY_URL/openai/ernie/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "ernie-bot-turbo"
    }
    "Groq" = @{
        key = $env:GROQ_KEY
        url = "$GATEWAY_URL/openai/groq/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "llama2-70b-4096"
    }
    "Perplexity" = @{
        key = $env:PERPLEXITY_KEY
        url = "$GATEWAY_URL/openai/perplexity/v1/chat/completions"
        header = "Authorization"
        prefix = "Bearer "
        model = "llama-3.1-sonar-small-128k-online"
    }
}

$successCount = 0
$skipCount = 0
$failCount = 0

foreach ($providerName in $providers.Keys) {
    $config = $providers[$providerName]
    
    Write-Host "Testing: $providerName" -ForegroundColor Yellow
    
    # Check if API key is set
    if (-not $config.key) {
        Write-Host "  ⊘ Skipped (no API key set)" -ForegroundColor Gray
        $skipCount++
        Write-Host ""
        continue
    }
    
    $headers = @{
        "$($config.header)" = "$($config.prefix)$($config.key)"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        model = $config.model
        messages = @(
            @{ role = "user"; content = "Say 'Hello from $providerName!'" }
        )
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $config.url `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30 `
            -ErrorAction Stop
        
        if ($response.choices -and $response.choices.Count -gt 0) {
            Write-Host "  ✓ Success" -ForegroundColor Green
            Write-Host "  Response: $($response.choices[0].message.content)" -ForegroundColor Gray
            $successCount++
        } else {
            Write-Host "  ✗ Failed: Unexpected response format" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "  ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
    Start-Sleep -Milliseconds 500
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✓ Success:  $successCount" -ForegroundColor Green
Write-Host "⊘ Skipped:  $skipCount" -ForegroundColor Gray
Write-Host "✗ Failed:   $failCount" -ForegroundColor Red
Write-Host ""

if ($skipCount -gt 0) {
    Write-Host "To test skipped providers, set environment variables:" -ForegroundColor Yellow
    Write-Host '  $env:OPENAI_KEY = "sk-..."' -ForegroundColor Gray
    Write-Host '  $env:GEMINI_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:CLAUDE_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:MISTRAL_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:COHERE_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:DEEPSEEK_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:QWEN_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:GLM_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:ERNIE_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:GROQ_KEY = "..."' -ForegroundColor Gray
    Write-Host '  $env:PERPLEXITY_KEY = "..."' -ForegroundColor Gray
    Write-Host ""
}
