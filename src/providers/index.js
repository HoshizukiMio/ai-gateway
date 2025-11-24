/**
 * Provider Registry
/**
 * Provider Registry
 * Central dispatcher for provider operations
 */

import * as openaiProvider from './openai.js';
import * as geminiProvider from './gemini.js';
import * as claudeProvider from './claude.js';
import * as genericOpenaiProvider from './generic-openai.js';

const providers = {
    openai: openaiProvider,
    gemini: geminiProvider,
    claude: claudeProvider,
    // All OpenAI-compatible providers use the generic adapter
    mistral: 'generic-openai',
    cohere: 'generic-openai',
    deepseek: 'generic-openai',
    qwen: 'generic-openai',
    glm: 'generic-openai',
    ernie: 'generic-openai',
    groq: 'generic-openai',
    perplexity: 'generic-openai'
};

/**
 * Get provider adapter
 * @param {string} providerName - Provider name
 * @returns {Object} Provider adapter
 */
export function getProviderAdapter(providerName) {
    const adapter = providers[providerName.toLowerCase()];

    // If it's a string, use the generic adapter
    if (adapter === 'generic-openai') {
        return genericOpenaiProvider;
    }

    return adapter;
}

/**
 * Make request to a provider
 * @param {string} providerName - Provider name
 * @param {Object} requestBody - Request body
 * @param {string} apiKey - API key
 * @param {string} endpoint - Endpoint
 * @param {string} model - Model name (for providers that need it in the URL)
 * @returns {Promise<Response>} Response
 */
export async function makeProviderRequest(providerName, requestBody, apiKey, endpoint, model) {
    const adapter = getProviderAdapter(providerName);
    if (!adapter) {
        throw new Error(`Unknown provider: ${providerName}`);
    }

    // For generic OpenAI adapter, pass the provider name
    if (adapter === genericOpenaiProvider) {
        return await adapter.makeRequest(providerName, requestBody, apiKey, endpoint, model);
    }

    return await adapter.makeRequest(requestBody, apiKey, endpoint, model);
}

/**
 * Process provider response
 * @param {string} providerName - Provider name
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} Processed response
 */
export async function processProviderResponse(providerName, response) {
    const adapter = getProviderAdapter(providerName);
    if (!adapter) {
        throw new Error(`Unknown provider: ${providerName}`);
    }

    return await adapter.processResponse(response);
}
