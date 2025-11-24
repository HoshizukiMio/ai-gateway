# Configuration Guide - AI Gateway

This guide explains how to configure and extend the AI Gateway service.

## Table of Contents

- [Provider Configuration](#provider-configuration)
- [Adding New Providers](#adding-new-providers)
- [Format Converters](#format-converters)
- [Custom Endpoint Mapping](#custom-endpoint-mapping)
- [Authentication Configuration](#authentication-configuration)

## Provider Configuration

All providers are configured in `src/config.js`. The configuration structure is:

```javascript
export const PROVIDERS = {
  providername: {
    name: 'Display Name',
    baseURL: 'https://api.provider.com',
    authHeader: 'Authorization',      // Header name for authentication
    authPrefix: 'Bearer ',             // Prefix for auth value (e.g., "Bearer ")
    nativeFormat: 'openai',            // Native API format
    endpoints: {
      // Endpoint mappings
      chatCompletions: '/v1/chat/completions'
    },
    requiredHeaders: {
      // Headers to include in all requests
      'Content-Type': 'application/json'
    }
  }
}
```

### Configuration Fields

- **name**: Human-readable provider name
- **baseURL**: Base URL for the provider's API
- **authHeader**: HTTP header used for authentication
- **authPrefix**: Prefix added before the API key (empty string if none)
- **nativeFormat**: The format this provider natively understands
- **endpoints**: Object mapping endpoint names to paths
- **requiredHeaders**: Headers included in every request to this provider

## Adding New Providers

### Example: Adding Cohere

1. Open `src/config.js`

2. Add the provider configuration:

```javascript
export const PROVIDERS = {
  // ... existing providers ...
  
  cohere: {
    name: 'Cohere',
    baseURL: 'https://api.cohere.ai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    nativeFormat: 'cohere',
    endpoints: {
      generate: '/v1/generate',
      chat: '/v1/chat'
    },
    requiredHeaders: {
      'Content-Type': 'application/json'
    }
  }
};
```

3. Add default model:

```javascript
export const DEFAULT_MODELS = {
  // ... existing models ...
  cohere: 'command'
};
```

4. Create provider adapter at `src/providers/cohere.js`:

```javascript
import { getProvider } from '../config.js';

export async function makeRequest(requestBody, apiKey, endpoint = '/v1/chat') {
  const config = getProvider('cohere');
  const url = config.baseURL + endpoint;
  
  const headers = {
    ...config.requiredHeaders,
    [config.authHeader]: config.authPrefix + apiKey
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });
  
  return response;
}

export async function processResponse(response) {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cohere API error: ${errorBody}`);
  }
  return await response.json();
}

export function handleStream(response) {
  return response.body;
}
```

5. Register the provider in `src/providers/index.js`:

```javascript
import * as cohereProvider from './cohere.js';

const providers = {
  // ... existing providers ...
  cohere: cohereProvider
};
```

### If the Provider Uses a Custom Format

If the provider doesn't use OpenAI, Gemini, or Claude format, you need to create a format converter:

1. Create `src/formats/cohere.js`:

```javascript
export function toOpenAI(cohereRequest) {
  // Convert Cohere format to OpenAI format
  return {
    messages: [
      { role: 'user', content: cohereRequest.message }
    ]
  };
}

export function fromOpenAI(openaiResponse) {
  // Convert OpenAI response to Cohere format
  return {
    text: openaiResponse.choices[0].message.content
  };
}

export function convertRequest(request, targetProvider) {
  switch (targetProvider) {
    case 'openai':
      return toOpenAI(request);
    // Add more conversions as needed
    default:
      return request;
  }
}

export function convertResponse(response, sourceProvider) {
  switch (sourceProvider) {
    case 'openai':
      return fromOpenAI(response);
    // Add more conversions as needed
    default:
      return response;
  }
}
```

2. Register the format in `src/formats/index.js`:

```javascript
import * as cohereFormat from './cohere.js';

const formatHandlers = {
  // ... existing formats ...
  cohere: cohereFormat
};
```

3. Add to `src/config.js`:

```javascript
export const FORMATS = {
  // ... existing formats ...
  cohere: 'cohere'
};
```

## Custom Endpoint Mapping

### Simple Endpoints

For most providers, endpoints are simple paths:

```javascript
endpoints: {
  chat: '/v1/chat/completions'
}
```

### Template Variables

Some providers (like Gemini) include the model in the URL:

```javascript
endpoints: {
  generateContent: '/v1beta/models/{model}:generateContent'
}
```

The `{model}` variable will be replaced with the actual model name.

### Handling in Provider Adapter

Your provider adapter should handle template variables:

```javascript
import { replaceTemplateVars } from '../utils.js';

export async function makeRequest(requestBody, apiKey, endpoint, model) {
  const config = getProvider('yourprovider');
  
  // Replace template variables
  const finalEndpoint = replaceTemplateVars(endpoint, { model });
  const url = config.baseURL + finalEndpoint;
  
  // ... rest of implementation
}
```

## Authentication Configuration

### Bearer Token (OpenAI Style)

```javascript
{
  authHeader: 'Authorization',
  authPrefix: 'Bearer '
}
```

Usage:
```
Authorization: Bearer sk-xxxxxxxxxxxxx
```

### API Key Header (Direct)

```javascript
{
  authHeader: 'x-api-key',
  authPrefix: ''
}
```

Usage:
```
x-api-key: your-api-key
```

### Query Parameter Authentication

Some providers use query parameters. Handle this in the provider adapter:

```javascript
export async function makeRequest(requestBody, apiKey, endpoint) {
  const config = getProvider('yourprovider');
  const url = `${config.baseURL}${endpoint}?api_key=${apiKey}`;
  
  // ... rest of implementation
}
```

### Custom Headers

Some providers require additional headers:

```javascript
{
  requiredHeaders: {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'X-Custom-Header': 'value'
  }
}
```

## Testing Your Configuration

After adding a new provider, test it with:

```bash
npm run dev
```

Then make a test request:

```bash
curl http://localhost:8787/openai/newprovider/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "model-name",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Best Practices

1. **Start with OpenAI format**: Most AI providers have OpenAI-compatible endpoints, making integration easier.

2. **Test thoroughly**: Test all format combinations when adding a new provider.

3. **Handle errors gracefully**: Ensure your provider adapter properly handles and reports errors.

4. **Document model names**: Add default models to `DEFAULT_MODELS` in `config.js`.

5. **Version carefully**: If a provider has multiple API versions, consider adding version to the provider name (e.g., `geminiv1`, `geminiv2`).

## Example: Complete Provider Addition

Here's a complete example adding a fictional "SuperAI" provider:

```javascript
// In src/config.js
export const PROVIDERS = {
  // ... existing providers ...
  superai: {
    name: 'SuperAI',
    baseURL: 'https://api.superai.com',
    authHeader: 'X-API-Key',
    authPrefix: '',
    nativeFormat: 'openai', // Uses OpenAI-compatible format
    endpoints: {
      chat: '/v1/chat/completions',
      embeddings: '/v1/embeddings'
    },
    requiredHeaders: {
      'Content-Type': 'application/json',
      'X-API-Version': '2024-01'
    }
  }
};

export const DEFAULT_MODELS = {
  // ... existing models ...
  superai: 'super-model-v1'
};
```

```javascript
// Create src/providers/superai.js
import { getProvider } from '../config.js';

export async function makeRequest(requestBody, apiKey, endpoint = '/v1/chat/completions') {
  const config = getProvider('superai');
  const url = config.baseURL + endpoint;
  
  const headers = {
    ...config.requiredHeaders,
    [config.authHeader]: config.authPrefix + apiKey
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });
  
  return response;
}

export async function processResponse(response) {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`SuperAI API error: ${errorBody}`);
  }
  return await response.json();
}

export function handleStream(response) {
  return response.body;
}
```

```javascript
// Update src/providers/index.js
import * as superaiProvider from './superai.js';

const providers = {
  openai: openaiProvider,
  gemini: geminiProvider,
  claude: claudeProvider,
  superai: superaiProvider  // Add this line
};
```

Now you can use:

```bash
curl https://your-gateway.workers.dev/openai/superai/v1/chat/completions \
  -H "X-API-Key: YOUR_SUPERAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"super-model-v1","messages":[{"role":"user","content":"Hello"}]}'
```

---

For more information, see the main [README.md](README.md).
