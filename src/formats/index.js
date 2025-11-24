/**
 * Format Handler Registry
 * Central dispatcher for format conversions
 */

import * as openaiFormat from './openai.js';
import * as geminiFormat from './gemini.js';
import * as claudeFormat from './claude.js';

const formatHandlers = {
    openai: openaiFormat,
    gemini: geminiFormat,
    claude: claudeFormat
};

/**
 * Get format handler for a specific format
 * @param {string} format - Format name
 * @returns {Object} Format handler
 */
export function getFormatHandler(format) {
    return formatHandlers[format.toLowerCase()];
}

/**
 * Convert request from one format to target provider format
 * @param {Object} request - Request body
 * @param {string} sourceFormat - Source format name
 * @param {string} targetProvider - Target provider name
 * @returns {Object} Converted request
 */
export function convertRequest(request, sourceFormat, targetProvider) {
    const handler = getFormatHandler(sourceFormat);
    if (!handler) {
        throw new Error(`Unknown source format: ${sourceFormat}`);
    }

    return handler.convertRequest(request, targetProvider);
}

/**
 * Convert response from provider format to target format
 * @param {Object} response - Response body
 * @param {string} sourceProvider - Source provider name
 * @param {string} targetFormat - Target format name
 * @param {string} model - Model name
 * @returns {Object} Converted response
 */
export function convertResponse(response, sourceProvider, targetFormat, model) {
    const handler = getFormatHandler(targetFormat);
    if (!handler) {
        throw new Error(`Unknown target format: ${targetFormat}`);
    }

    return handler.convertResponse(response, sourceProvider, model);
}
