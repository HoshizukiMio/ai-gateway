/**
 * UI Generator for AI Gateway
 * Generates a beautiful, responsive HTML interface to list available providers
 */

export function generateUI(providers) {
    const providerList = Object.entries(providers).map(([key, provider]) => {
        const endpoints = Object.entries(provider.endpoints).map(([name, path]) => `
      <div class="endpoint-item">
        <span class="endpoint-method">POST</span>
        <code class="endpoint-path">${path}</code>
        <button class="copy-btn" onclick="copyToClipboard('${path}')" title="Copy path">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
    `).join('');

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
            <span class="label">Auth Header:</span>
            <code class="value">${provider.authHeader}</code>
          </div>
          <div class="info-row">
            <span class="label">Native Format:</span>
            <code class="value">${provider.nativeFormat}</code>
          </div>
        </div>
        <div class="endpoints-section">
          <h3>Endpoints</h3>
          <div class="endpoints-list">
            ${endpoints}
          </div>
        </div>
      </div>
    `;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Gateway Service</title>
  <style>
    :root {
      --bg-color: #0f172a;
      --card-bg: #1e293b;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --accent: #38bdf8;
      --accent-hover: #0ea5e9;
      --border: #334155;
      --code-bg: #020617;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 4rem;
      padding: 2rem 0;
      background: radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
    }

    h1 {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.2rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .provider-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .provider-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border-color: var(--accent);
    }

    .provider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .provider-header h2 {
      font-size: 1.5rem;
      color: var(--text-primary);
    }

    .provider-badge {
      background-color: rgba(56, 189, 248, 0.1);
      color: var(--accent);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
    }

    .label {
      color: var(--text-secondary);
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      background-color: var(--code-bg);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.85rem;
      color: #e2e8f0;
    }

    .endpoints-section {
      margin-top: 1.5rem;
    }

    .endpoints-section h3 {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .endpoint-item {
      display: flex;
      align-items: center;
      background-color: var(--code-bg);
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      border: 1px solid transparent;
    }

    .endpoint-item:hover {
      border-color: var(--border);
    }

    .endpoint-method {
      color: #10b981;
      font-weight: bold;
      font-size: 0.8rem;
      margin-right: 0.75rem;
      min-width: 40px;
    }

    .endpoint-path {
      flex-grow: 1;
      background: none;
      padding: 0;
      color: var(--text-primary);
      overflow-x: auto;
      white-space: nowrap;
    }

    .copy-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      transition: color 0.2s, background-color 0.2s;
    }

    .copy-btn:hover {
      color: var(--accent);
      background-color: rgba(56, 189, 248, 0.1);
    }

    footer {
      text-align: center;
      margin-top: 4rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #10b981;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    
    .toast.show {
      opacity: 1;
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
      ${providerList}
    </div>

    <footer>
      <p>Powered by Cloudflare Workers</p>
    </footer>
  </div>
  
  <div id="toast" class="toast">Copied to clipboard!</div>

  <script>
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2000);
      });
    }
  </script>
</body>
</html>
  `;
}
