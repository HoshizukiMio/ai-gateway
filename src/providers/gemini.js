/**
 * Google Gemini Provider Adapter
 * Handles communication with Google Gemini API
 */

import { getProvider } from '../config.js';
import { replaceTemplateVars } from '../utils.js';

/**
 * Make a request to Gemini API
 * @param {Object} requestBody - Request body (already in Gemini format)
 * @param {string} apiKey - User's API key
 * @param {string} endpoint - API endpoint
 * @param {string} model - Model name
 * @returns {Promise<Response>} API response
 */
export async function makeRequest(requestBody, apiKey, endpoint = '/v1beta/generateContent', model = 'gemini-pro') {
    const config = getProvider('gemini');

    // Handle model in endpoint for Gemini
    // Gemini endpoints look like: /v1beta/models/{model}:generateContent
    let finalEndpoint = endpoint;
    if (endpoint.includes('{model}')) {
        finalEndpoint = replaceTemplateVars(endpoint, { model });
    } else if (endpoint.includes(':')) {
        // If endpoint already has the action (e.g., :generateContent)
        const action = endpoint.split('/').pop();
        finalEndpoint = `/v1beta/models/${model}:${action.replace(':', '')}`;
    } else {
        finalEndpoint = `/v1beta/models/${model}:generateContent`;
    }

    // Build request URL with API key as query parameter (Gemini's preferred method)
    const url = `${config.baseURL}${finalEndpoint}?key=${apiKey}`;

    // Prepare headers
    const headers = {
        ...config.requiredHeaders
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
 * Process response from Gemini
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
        throw new Error(`Gemini API error: ${errorMessage}`);
    }

    return await response.json();
}

/**
 * Handle streaming response from Gemini
 * @param {Response} response - Fetch response
 * @returns {ReadableStream} Stream
 */
export function handleStream(response) {
    return response.body;
}
