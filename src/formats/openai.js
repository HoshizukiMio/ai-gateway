/**
 * OpenAI Format Converter
 * Handles conversion to/from OpenAI API format
 */

import { deepClone } from '../utils.js';

/**
 * Convert OpenAI format to Gemini format
 * @param {Object} openaiRequest - OpenAI format request
 * @returns {Object} Gemini format request
 */
export function toGemini(openaiRequest) {
    const { messages, model, temperature, max_tokens, stream, ...rest } = openaiRequest;

    // Convert messages to Gemini contents format
    const contents = messages.map(msg => {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        return {
            role,
            parts: [{ text: msg.content }]
        };
    });

    const geminiRequest = {
        contents,
        generationConfig: {}
    };

    if (temperature !== undefined) {
        geminiRequest.generationConfig.temperature = temperature;
    }

    if (max_tokens !== undefined) {
        geminiRequest.generationConfig.maxOutputTokens = max_tokens;
    }

    return geminiRequest;
}

/**
 * Convert OpenAI format to Claude format
 * @param {Object} openaiRequest - OpenAI format request
 * @returns {Object} Claude format request
 */
export function toClaude(openaiRequest) {
    const { messages, model, temperature, max_tokens, stream, ...rest } = openaiRequest;

    // Filter out system messages and convert to Claude format
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const claudeRequest = {
        model: model || 'claude-3-sonnet-20240229',
        messages: conversationMessages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        })),
        max_tokens: max_tokens || 1024
    };

    // Add system message if present
    if (systemMessages.length > 0) {
        claudeRequest.system = systemMessages.map(m => m.content).join('\n');
    }

    if (temperature !== undefined) {
        claudeRequest.temperature = temperature;
    }

    if (stream !== undefined) {
        claudeRequest.stream = stream;
    }

    return claudeRequest;
}

/**
 * Convert Gemini response to OpenAI format
 * @param {Object} geminiResponse - Gemini format response
 * @param {string} model - Model name
 * @returns {Object} OpenAI format response
 */
export function fromGemini(geminiResponse, model = 'gemini-pro') {
    const candidate = geminiResponse.candidates?.[0];

    if (!candidate) {
        return {
            id: 'chatcmpl-' + Date.now(),
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model,
            choices: [],
            usage: {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0
            }
        };
    }

    const content = candidate.content?.parts?.[0]?.text || '';
    const finishReason = candidate.finishReason?.toLowerCase() || 'stop';

    return {
        id: 'chatcmpl-' + Date.now(),
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [
            {
                index: 0,
                message: {
                    role: 'assistant',
                    content
                },
                finish_reason: finishReason === 'stop' ? 'stop' : finishReason
            }
        ],
        usage: {
            prompt_tokens: geminiResponse.usageMetadata?.promptTokenCount || 0,
            completion_tokens: geminiResponse.usageMetadata?.candidatesTokenCount || 0,
            total_tokens: geminiResponse.usageMetadata?.totalTokenCount || 0
        }
    };
}

/**
 * Convert Claude response to OpenAI format
 * @param {Object} claudeResponse - Claude format response
 * @param {string} model - Model name
 * @returns {Object} OpenAI format response
 */
export function fromClaude(claudeResponse, model = 'claude-3-sonnet-20240229') {
    const content = claudeResponse.content?.[0]?.text || '';

    return {
        id: 'chatcmpl-' + Date.now(),
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [
            {
                index: 0,
                message: {
                    role: 'assistant',
                    content
                },
                finish_reason: claudeResponse.stop_reason || 'stop'
            }
        ],
        usage: {
            prompt_tokens: claudeResponse.usage?.input_tokens || 0,
            completion_tokens: claudeResponse.usage?.output_tokens || 0,
            total_tokens: (claudeResponse.usage?.input_tokens || 0) + (claudeResponse.usage?.output_tokens || 0)
        }
    };
}

/**
 * Convert request to target provider format
 * @param {Object} request - OpenAI format request
 * @param {string} targetProvider - Target provider name
 * @returns {Object} Converted request
 */
export function convertRequest(request, targetProvider) {
    switch (targetProvider) {
        case 'gemini':
            return toGemini(request);
        case 'claude':
            return toClaude(request);
        case 'openai':
        default:
            return deepClone(request);
    }
}

/**
 * Convert response from provider to OpenAI format
 * @param {Object} response - Provider response
 * @param {string} sourceProvider - Source provider name
 * @param {string} model - Model name
 * @returns {Object} OpenAI format response
 */
export function convertResponse(response, sourceProvider, model) {
    switch (sourceProvider) {
        case 'gemini':
            return fromGemini(response, model);
        case 'claude':
            return fromClaude(response, model);
        case 'openai':
        default:
            return response;
    }
}
