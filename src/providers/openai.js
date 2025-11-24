/**
 * OpenAI Provider Adapter
 * Handles communication with OpenAI API
 */

import { getProvider } from '../config.js';
import { replaceTemplateVars } from '../utils.js';

/**
 * Make a request to OpenAI API
 * @param {Object} requestBody - Request body (already in OpenAI format)
 * @param {string} apiKey - User's API key
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Response>} API response
 */
export async function makeRequest(requestBody, apiKey, endpoint = '/v1/chat/completions') {
    const config = getProvider('openai');

    // Build request URL
    const url = config.baseURL + endpoint;

    // Prepare headers
    const headers = {
        ...config.requiredHeaders,
        [config.authHeader]: config.authPrefix + apiKey
    };

    // Make request
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
    });

    return response;
}

/**
 * Process response from OpenAI
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} Parsed response body
 */
export async function processResponse(response) {
    if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage;
        try {
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.error?.message || errorBody;
        } catch {
            errorMessage = errorBody;
        }
        throw new Error(`OpenAI API error: ${errorMessage}`);
    }

    return await response.json();
}

/**
 * Handle streaming response from OpenAI
 * @param {Response} response - Fetch response
 * @returns {ReadableStream} Stream
 */
export function handleStream(response) {
    return response.body;
}
