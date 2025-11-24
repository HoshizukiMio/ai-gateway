/**
 * Utility functions for the AI Gateway
 */

/**
 * Extract API key from request headers
 * Supports multiple header formats commonly used by AI providers
 * @param {Request} request - Incoming request
 * @returns {string|null} Extracted API key or null
 */
export function extractApiKey(request) {
    const headers = request.headers;

    // Try Authorization header (Bearer token)
    const authHeader = headers.get('Authorization');
    if (authHeader) {
        if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    // Try x-api-key header
    const apiKeyHeader = headers.get('x-api-key');
    if (apiKeyHeader) {
        return apiKeyHeader;
    }

    // Try x-goog-api-key (Gemini specific)
    const googApiKey = headers.get('x-goog-api-key');
    if (googApiKey) {
        return googApiKey;
    }

    return null;
}

/**
 * Create a standardized error response
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @returns {Response}
 */
export function createErrorResponse(status, message, code = 'error') {
    return new Response(
        JSON.stringify({
            error: {
                message,
                code,
                status
            }
        }),
        {
            status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    );
}

/**
 * Create a CORS preflight response
 * @returns {Response}
 */
export function createCorsResponse() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400'
        }
    });
}

/**
 * Add CORS headers to a response
 * @param {Response} response - Original response
 * @returns {Response} Response with CORS headers
 */
export function addCorsHeaders(response) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', '*');

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
}

/**
 * Parse request body as JSON
 * @param {Request} request - Incoming request
 * @returns {Promise<Object>} Parsed JSON body
 */
export async function parseRequestBody(request) {
    try {
        const contentType = request.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            return await request.json();
        }
        return {};
    } catch (error) {
        throw new Error('Invalid JSON in request body');
    }
}

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} URL with parameters
 */
export function buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
        }
    });
    return url.toString();
}

/**
 * Check if request expects streaming response
 * @param {Object} body - Request body
 * @returns {boolean}
 */
export function isStreamingRequest(body) {
    return body && body.stream === true;
}

/**
 * Replace template variables in a string
 * @param {string} template - Template string with {variables}
 * @param {Object} vars - Variables to replace
 * @returns {string} Processed string
 */
export function replaceTemplateVars(template, vars) {
    let result = template;
    Object.entries(vars).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value);
    });
    return result;
}

/**
 * Validate that required fields exist in an object
 * @param {Object} obj - Object to validate
 * @param {string[]} requiredFields - Required field names
 * @throws {Error} If a required field is missing
 */
export function validateRequiredFields(obj, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
