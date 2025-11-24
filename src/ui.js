/**
 * UI Generator for AI Gateway
 * Generates a beautiful, responsive HTML interface to list available providers
 */

/**
 * UI Generator for AI Gateway
 * Generates a beautiful, responsive HTML interface to list available providers
 */

function generateEndpointItem(key, name, path, provider, isRecommended = false) {
  const endpointId = `${key}-${name}`;
  const recommendedClass = isRecommended ? 'recommended' : '';
  const recommendedTag = isRecommended ? '<span class="endpoint-tag">Recommended</span>' : '';

  // Determine format for Curl generation
  let format = provider.nativeFormat;
  if (isRecommended) {
    format = 'openai'; // Recommended endpoints are always OpenAI compatible
  }

  return `
      <div class="endpoint-item ${recommendedClass}">
        <div class="endpoint-header">
            <span class="endpoint-method">POST</span>
            <code class="endpoint-path">${path}</code>
            ${recommendedTag}
            <div class="endpoint-actions">
                <button class="action-btn" onclick="copyToClipboard('${path}')" title="Copy path">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
                <button class="action-btn" onclick="toggleCurl('${key}', '${name}', '${path}', '${provider.authHeader}', '${provider.authPrefix}', '${format}')" title="Generate Curl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                </button>
            </div>
        </div>
        <div id="curl-${endpointId}" class="curl-section" style="display: none;">
            <pre><code class="language-bash" id="curl-code-${endpointId}"></code></pre>
            <button class="copy-curl-btn" onclick="copyCurl('${key}', '${name}')">Copy Command</button>
        </div>
      </div>`;
}

function generateProviderCard(key, provider) {
  const isNativeOpenAI = provider.nativeFormat === 'openai';

  // 1. Generate OpenAI Compatible Endpoint (Standard)
  const openaiPath = `/openai/${key}/v1/chat/completions`;
  const openaiEndpointHtml = generateEndpointItem(key, 'openai-chat', openaiPath, provider, true);

  // 2. Generate Native Endpoints
  const nativeEndpointsHtml = Object.entries(provider.endpoints).map(([name, path]) => {
    // Skip chatCompletions if it's already shown as the recommended OpenAI one (for OpenAI native providers)
    if (isNativeOpenAI && path === '/v1/chat/completions') return '';

    const fullPath = `/${provider.nativeFormat}/${key}${path}`;
    return generateEndpointItem(key, name, fullPath, provider, false);
  }).join('');

  return `
      <div class="provider-card">
        <div class="provider-header">
          <h2>${provider.name}</h2>
          <span class="provider-badge">${key}</span>
        </div>
        <div class="provider-info">
          <div class="info-row">
            <span class="label">Base URL:</span>
            <code class="value">${provider.baseURL}</code>
          </div>
          <div class="info-row">
            <span class="label">Native Format:</span>
            <code class="value">${provider.nativeFormat}</code>
          </div>
        </div>
        <div class="endpoints-section">
          <h3>OpenAI Compatible (Recommended)</h3>
          <div class="endpoints-list">
            ${openaiEndpointHtml}
          </div>
          ${nativeEndpointsHtml.trim() ? `
          <h3>Native / Other Endpoints</h3>
          <div class="endpoints-list">
            ${nativeEndpointsHtml}
          </div>
          ` : ''}
        </div>
      </div>
    `;
}

function generatePage(providerListHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Gateway Service</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.7);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --accent: #38bdf8;
      --accent-hover: #0ea5e9;
      --border: rgba(51, 65, 85, 0.5);
      --code-bg: rgba(2, 6, 23, 0.5);
      --glass-border: 1px solid rgba(255, 255, 255, 0.1);
      --glass-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      --success: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-color);
      background-image: 
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.15) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text-primary);
      line-height: 1.6;
      padding: 2rem;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 4rem;
      padding: 3rem 0;
      position: relative;
    }

    header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background: linear-gradient(90deg, #38bdf8, #818cf8);
        border-radius: 2px;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      background: linear-gradient(to right, #38bdf8, #818cf8, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
      text-shadow: 0 0 30px rgba(56, 189, 248, 0.3);
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.25rem;
      font-weight: 300;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 2rem;
    }

    .provider-card {
      background-color: var(--card-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: var(--glass-border);
      border-radius: 1.5rem;
      padding: 2rem;
      transition: all 0.3s ease;
      box-shadow: var(--glass-shadow);
      position: relative;
      overflow: hidden;
    }

    .provider-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--accent), transparent);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .provider-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.2);
      border-color: rgba(56, 189, 248, 0.3);
    }

    .provider-card:hover::before {
        opacity: 1;
    }

    .provider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .provider-header h2 {
      font-size: 1.75rem;
      color: var(--text-primary);
      font-weight: 700;
    }

    .provider-badge {
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent);
      padding: 0.35rem 1rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 1px solid rgba(56, 189, 248, 0.2);
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.95rem;
      align-items: center;
    }

    .label {
      color: var(--text-secondary);
      font-weight: 500;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      background-color: var(--code-bg);
      padding: 0.3rem 0.6rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      color: #e2e8f0;
      border: 1px solid rgba(255,255,255,0.05);
    }

    .endpoints-section {
      margin-top: 2rem;
    }

    .endpoints-section h3 {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
      margin-top: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .endpoint-item {
      background-color: var(--code-bg);
      border-radius: 0.75rem;
      margin-bottom: 0.75rem;
      border: 1px solid transparent;
      transition: all 0.2s;
      overflow: hidden;
    }
    
    .endpoint-item.recommended {
        border-color: rgba(16, 185, 129, 0.3);
        background-color: rgba(16, 185, 129, 0.05);
    }

    .endpoint-header {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
    }

    .endpoint-item:hover {
      border-color: var(--border);
      background-color: rgba(2, 6, 23, 0.8);
    }
    
    .endpoint-item.recommended:hover {
        border-color: rgba(16, 185, 129, 0.5);
    }

    .endpoint-method {
      color: var(--success);
      font-weight: 800;
      font-size: 0.75rem;
      margin-right: 1rem;
      min-width: 40px;
      font-family: 'JetBrains Mono', monospace;
    }

    .endpoint-path {
      flex-grow: 1;
      background: none;
      padding: 0;
      color: var(--text-primary);
      overflow-x: auto;
      white-space: nowrap;
      border: none;
    }
    
    .endpoint-tag {
        font-size: 0.65rem;
        background: rgba(16, 185, 129, 0.2);
        color: var(--success);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        margin-right: 0.5rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .endpoint-actions {
        display: flex;
        gap: 0.5rem;
    }

    .action-btn {
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.4rem;
      border-radius: 0.4rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-btn:hover {
      color: var(--accent);
      background-color: rgba(56, 189, 248, 0.15);
    }

    .curl-section {
        background-color: #000;
        padding: 1rem;
        border-top: 1px solid var(--border);
        position: relative;
    }

    .curl-section pre {
        white-space: pre-wrap;
        word-break: break-all;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: #a5b4fc;
        margin-bottom: 0.5rem;
    }

    .copy-curl-btn {
        background-color: var(--accent);
        color: #0f172a;
        border: none;
        padding: 0.3rem 0.8rem;
        border-radius: 0.3rem;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        display: block;
        margin-left: auto;
    }

    .copy-curl-btn:hover {
        background-color: var(--accent-hover);
    }

    footer {
      text-align: center;
      margin-top: 5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      padding-bottom: 2rem;
    }
    
    .toast {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background-color: var(--success);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      pointer-events: none;
      z-index: 100;
      font-weight: 500;
    }
    
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>AI Gateway</h1>
      <p class="subtitle">Unified interface for multiple AI providers</p>
    </header>

    <div class="grid">
      ${providerListHtml}
    </div>

    <footer>
      <p>Powered by Cloudflare Workers</p>
    </footer>
  </div>
  
  <div id="toast" class="toast">Copied to clipboard!</div>
  
  <script>
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
      });
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2000);
    }

    function toggleCurl(providerKey, endpointName, path, authHeader, authPrefix, format) {
        const sectionId = \`curl-\${providerKey}-\${endpointName}\`;
        const codeId = \`curl-code-\${providerKey}-\${endpointName}\`;
        const section = document.getElementById(sectionId);
        const codeBlock = document.getElementById(codeId);
        
        if (section.style.display === 'none') {
            const url = window.location.origin + path;
            const prefix = authPrefix ? authPrefix : '';
            
            let body = '';
            
            if (format === 'openai') {
                body = \`{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }\`;
            } else if (format === 'gemini') {
                body = \`{
    "contents": [{
      "parts": [{"text": "Hello!"}]
    }]
  }\`;
            } else if (format === 'claude') {
                body = \`{
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }\`;
            } else {
                // Default fallback
                body = \`{
    "prompt": "Hello!"
  }\`;
            }

            const curlCommand = \`curl -X POST "\${url}" \\
  -H "Content-Type: application/json" \\
  -H "\${authHeader}: \${prefix}YOUR_API_KEY" \\
  -d '\${body}'\`;
            
            codeBlock.textContent = curlCommand;
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    }

    function copyCurl(providerKey, endpointName) {
        const codeId = \`curl-code-\${providerKey}-\${endpointName}\`;
        const text = document.getElementById(codeId).textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Curl command copied!');
        });
    }
  </script>
</body>
</html>
  `;
}

export function generateUI(providers) {
  const providerListHtml = Object.entries(providers)
    .map(([key, provider]) => generateProviderCard(key, provider))
    .join('');

  return generatePage(providerListHtml);
}
