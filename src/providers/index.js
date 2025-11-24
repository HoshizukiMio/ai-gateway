/**
 * Provider Registry
 * Central dispatcher for provider operations
 */

import * as openaiProvider from './openai.js';
import * as geminiProvider from './gemini.js';
import * as claudeProvider from './claude.js';

const providers = {
    openai: openaiProvider,
    gemini: geminiProvider,
    claude: claudeProvider
};

/**
 * Get provider adapter
 * @param {string} providerName - Provider name
 * @returns {Object} Provider adapter
 */
export function getProviderAdapter(providerName) {
    return providers[providerName.toLowerCase()];
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
