/**
 * Request router for the AI Gateway
 * Parses URLs in the format: /[format]/[provider]/[endpoint]
 */

import { isValidFormat, isValidProvider } from './config.js';
import { extractApiKey } from './utils.js';

/**
 * Parse the request URL and extract routing information
 * @param {URL} url - Request URL
 * @returns {Object} Parsed route information
 */
export function parseRoute(url) {
    const pathname = url.pathname;

    // Remove leading slash and split path
    const parts = pathname.replace(/^\/+/, '').split('/');

    if (parts.length < 3) {
        return {
            valid: false,
            error: 'Invalid URL format. Expected: /[format]/[provider]/[endpoint]'
        };
    }

    const [format, provider, ...endpointParts] = parts;
    const endpoint = '/' + endpointParts.join('/');

    // Validate format and provider
    if (!isValidFormat(format)) {
        return {
            valid: false,
            error: `Unsupported format: ${format}. Supported formats: openai, gemini, claude`
        };
    }

    if (!isValidProvider(provider)) {
        return {
            valid: false,
            error: `Unsupported provider: ${provider}. Supported providers: openai, gemini, claude`
        };
    }

    return {
        valid: true,
        format: format.toLowerCase(),
        provider: provider.toLowerCase(),
        endpoint,
        query: Object.fromEntries(url.searchParams)
    };
}

/**
 * Validate the incoming request
 * @param {Request} request - Incoming request
 * @returns {Object} Validation result
 */
export function validateRequest(request) {
    // Extract API key
    const apiKey = extractApiKey(request);

    if (!apiKey) {
        return {
            valid: false,
            error: 'Missing API key. Provide via Authorization header or x-api-key header.'
        };
    }

    // Validate HTTP method
    const method = request.method.toUpperCase();
    if (!['GET', 'POST', 'OPTIONS'].includes(method)) {
        return {
            valid: false,
            error: `Unsupported HTTP method: ${method}`
        };
    }

    return {
        valid: true,
        apiKey,
        method
    };
}

/**
 * Parse and validate the complete request
 * @param {Request} request - Incoming request
 * @returns {Object} Complete routing information
 */
export function routeRequest(request) {
    const url = new URL(request.url);

    // Parse route
    const route = parseRoute(url);
    if (!route.valid) {
        return route;
    }

    // Validate request
    const validation = validateRequest(request);
    if (!validation.valid) {
        return validation;
    }

    return {
        valid: true,
        format: route.format,
        provider: route.provider,
        endpoint: route.endpoint,
        query: route.query,
        apiKey: validation.apiKey,
        method: validation.method
    };
}
