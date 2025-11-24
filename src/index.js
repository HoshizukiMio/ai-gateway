/**
 * AI Gateway - Multi-provider, multi-format AI model gateway
 * 
 * This Cloudflare Worker acts as a unified gateway to multiple AI providers
 * (OpenAI, Google Gemini, Anthropic Claude) with automatic format conversion.
 * 
 * URL Pattern: /[format]/[provider]/[endpoint]
 * Example: /openai/gemini/v1/chat/completions
 *          Accepts OpenAI format, converts to Gemini, returns OpenAI format
 */

import { routeRequest } from './router.js';
import { convertRequest, convertResponse } from './formats/index.js';
import { makeProviderRequest, processProviderResponse } from './providers/index.js';
import { createErrorResponse, createCorsResponse, addCorsHeaders, parseRequestBody, isStreamingRequest } from './utils.js';
import { getProvider, DEFAULT_MODELS, PROVIDERS } from './config.js';
import { generateUI } from './ui.js';

/**
 * Main request handler
 */
export default {
	async fetch(request, env, ctx) {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return createCorsResponse();
		}

		const url = new URL(request.url);

		// Serve UI on root path
		if (url.pathname === '/' || url.pathname === '') {
			const html = generateUI(PROVIDERS);
			return new Response(html, {
				headers: {
					'Content-Type': 'text/html;charset=UTF-8',
				},
			});
		}

		try {
			// Route and validate the request
			const route = routeRequest(request);

			if (!route.valid) {
				return createErrorResponse(400, route.error, 'invalid_request');
			}

			const { format, provider, endpoint, apiKey } = route;

			// Parse request body
			let requestBody;
			try {
				requestBody = await parseRequestBody(request);
			} catch (error) {
				return createErrorResponse(400, 'Invalid request body: ' + error.message, 'invalid_request_body');
			}

			// Extract model from request if available
			let model = requestBody.model || DEFAULT_MODELS[provider];

			// Convert request format if needed
			let convertedRequest;
			try {
				convertedRequest = convertRequest(requestBody, format, provider);

				// Ensure model is set for the target provider
				if (!convertedRequest.model && provider !== 'gemini') {
					convertedRequest.model = model;
				}
			} catch (error) {
				return createErrorResponse(400, 'Format conversion error: ' + error.message, 'conversion_error');
			}

			// Make request to target provider
			let providerResponse;
			try {
				providerResponse = await makeProviderRequest(provider, convertedRequest, apiKey, endpoint, model);
			} catch (error) {
				return createErrorResponse(502, 'Provider request failed: ' + error.message, 'provider_error');
			}

			// Check if this is a streaming request
			const isStreaming = isStreamingRequest(requestBody);

			if (isStreaming) {
				// For streaming responses, pass through directly
				// Format conversion for streaming is more complex and would require
				// parsing SSE events - for now, we pass through
				return addCorsHeaders(providerResponse);
			}

			// Process provider response
			let providerData;
			try {
				providerData = await processProviderResponse(provider, providerResponse);
			} catch (error) {
				return createErrorResponse(502, 'Provider response processing failed: ' + error.message, 'provider_error');
			}

			// Convert response back to requested format
			let finalResponse;
			try {
				finalResponse = convertResponse(providerData, provider, format, model);
			} catch (error) {
				return createErrorResponse(500, 'Response conversion error: ' + error.message, 'conversion_error');
			}

			// Return the response
			const response = new Response(JSON.stringify(finalResponse), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return addCorsHeaders(response);

		} catch (error) {
			console.error('Gateway error:', error);
			return createErrorResponse(500, 'Internal gateway error: ' + error.message, 'gateway_error');
		}
	},
};

