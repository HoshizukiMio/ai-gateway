# AI Gateway Test Script
# This script tests basic functionality of the gateway

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "AI Gateway Testing" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$GATEWAY_URL = "http://127.0.0.1:8787"

# Test 1: Invalid URL format
Write-Host "Test 1: Invalid URL format (should fail)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/invalid" -Method POST -ErrorAction SilentlyContinue
} catch {
    Write-Host "✓ Correctly rejected invalid URL" -ForegroundColor Green
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Test 2: Missing API key
Write-Host "Test 2: Missing API key (should fail)" -ForegroundColor Yellow
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    messages = @(
        @{ role = "user"; content = "Hello" }
    )
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/openai/openai/v1/chat/completions" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction SilentlyContinue
} catch {
    Write-Host "✓ Correctly rejected request without API key" -ForegroundColor Green
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "  Error: $($errorContent.error.message)" -ForegroundColor Gray
}
Write-Host ""

# Test 3: Invalid format
Write-Host "Test 3: Invalid format (should fail)" -ForegroundColor Yellow
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer test-key"
}

try {
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/invalidformat/openai/v1/chat/completions" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction SilentlyContinue
} catch {
    Write-Host "✓ Correctly rejected invalid format" -ForegroundColor Green
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "  Error: $($errorContent.error.message)" -ForegroundColor Gray
}
Write-Host ""

# Test 4: Invalid provider
Write-Host "Test 4: Invalid provider (should fail)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/openai/invalidprovider/v1/chat/completions" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction SilentlyContinue
} catch {
    Write-Host "✓ Correctly rejected invalid provider" -ForegroundColor Green
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "  Error: $($errorContent.error.message)" -ForegroundColor Gray
}
Write-Host ""

# Test 5: CORS preflight
Write-Host "Test 5: CORS preflight (should succeed)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$GATEWAY_URL/openai/openai/v1/chat/completions" `
        -Method OPTIONS `
        -ErrorAction Stop
    if ($response.StatusCode -eq 204) {
        Write-Host "✓ CORS preflight successful" -ForegroundColor Green
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ CORS preflight failed" -ForegroundColor Red
}
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Basic Tests Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: To test with real API keys, run:" -ForegroundColor Yellow
Write-Host '  $headers = @{ "Authorization" = "Bearer YOUR_OPENAI_KEY"; "Content-Type" = "application/json" }' -ForegroundColor Gray
Write-Host '  $body = @{ model = "gpt-3.5-turbo"; messages = @(@{ role = "user"; content = "Hello" }) } | ConvertTo-Json' -ForegroundColor Gray
Write-Host '  Invoke-RestMethod -Uri "http://127.0.0.1:8787/openai/openai/v1/chat/completions" -Method POST -Headers $headers -Body $body' -ForegroundColor Gray
Write-Host ""
