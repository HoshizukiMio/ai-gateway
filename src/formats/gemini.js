/**
 * Gemini Format Converter
 * Handles conversion to/from Google Gemini API format
 */

import { deepClone } from '../utils.js';

/**
 * Convert Gemini format to OpenAI format
 * @param {Object} geminiRequest - Gemini format request
 * @returns {Object} OpenAI format request
 */
export function toOpenAI(geminiRequest) {
    const { contents, generationConfig, ...rest } = geminiRequest;

    // Convert contents to OpenAI messages format
    const messages = contents.map(content => {
        const role = content.role === 'model' ? 'assistant' : 'user';
        const text = content.parts?.[0]?.text || '';
        return {
            role,
            content: text
        };
    });

    const openaiRequest = {
        messages
    };

    if (generationConfig?.temperature !== undefined) {
        openaiRequest.temperature = generationConfig.temperature;
    }

    if (generationConfig?.maxOutputTokens !== undefined) {
        openaiRequest.max_tokens = generationConfig.maxOutputTokens;
    }

    return openaiRequest;
}

/**
 * Convert Gemini format to Claude format
 * @param {Object} geminiRequest - Gemini format request
 * @returns {Object} Claude format request
 */
export function toClaude(geminiRequest) {
    const { contents, generationConfig, ...rest } = geminiRequest;

    // Convert to messages
    const messages = contents
        .filter(c => c.role !== 'system')
        .map(content => {
            const role = content.role === 'model' ? 'assistant' : 'user';
            const text = content.parts?.[0]?.text || '';
            return {
                role,
                content: text
            };
        });

    const claudeRequest = {
        messages,
        max_tokens: generationConfig?.maxOutputTokens || 1024
    };

    if (generationConfig?.temperature !== undefined) {
        claudeRequest.temperature = generationConfig.temperature;
    }

    return claudeRequest;
}

/**
 * Convert OpenAI response to Gemini format
 * @param {Object} openaiResponse - OpenAI format response
 * @returns {Object} Gemini format response
 */
export function fromOpenAI(openaiResponse) {
    const choice = openaiResponse.choices?.[0];

    if (!choice) {
        return {
            candidates: [],
            usageMetadata: {
                promptTokenCount: 0,
                candidatesTokenCount: 0,
                totalTokenCount: 0
            }
        };
    }

    const content = choice.message?.content || '';

    return {
        candidates: [
            {
                content: {
                    parts: [{ text: content }],
                    role: 'model'
                },
                finishReason: choice.finish_reason?.toUpperCase() || 'STOP',
                index: 0
            }
        ],
        usageMetadata: {
            promptTokenCount: openaiResponse.usage?.prompt_tokens || 0,
            candidatesTokenCount: openaiResponse.usage?.completion_tokens || 0,
            totalTokenCount: openaiResponse.usage?.total_tokens || 0
        }
    };
}

/**
 * Convert Claude response to Gemini format
 * @param {Object} claudeResponse - Claude format response
 * @returns {Object} Gemini format response
 */
export function fromClaude(claudeResponse) {
    const content = claudeResponse.content?.[0]?.text || '';

    return {
        candidates: [
            {
                content: {
                    parts: [{ text: content }],
                    role: 'model'
                },
                finishReason: claudeResponse.stop_reason?.toUpperCase() || 'STOP',
                index: 0
            }
        ],
        usageMetadata: {
            promptTokenCount: claudeResponse.usage?.input_tokens || 0,
            candidatesTokenCount: claudeResponse.usage?.output_tokens || 0,
            totalTokenCount: (claudeResponse.usage?.input_tokens || 0) + (claudeResponse.usage?.output_tokens || 0)
        }
    };
}

/**
 * Convert request to target provider format
 * @param {Object} request - Gemini format request
 * @param {string} targetProvider - Target provider name
 * @returns {Object} Converted request
 */
export function convertRequest(request, targetProvider) {
    switch (targetProvider) {
        case 'openai':
            return toOpenAI(request);
        case 'claude':
            return toClaude(request);
        case 'gemini':
        default:
            return deepClone(request);
    }
}

/**
 * Convert response from provider to Gemini format
 * @param {Object} response - Provider response
 * @param {string} sourceProvider - Source provider name
 * @returns {Object} Gemini format response
 */
export function convertResponse(response, sourceProvider) {
    switch (sourceProvider) {
        case 'openai':
            return fromOpenAI(response);
        case 'claude':
            return fromClaude(response);
        case 'gemini':
        default:
            return response;
    }
}
