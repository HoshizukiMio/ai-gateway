/**
 * Claude (Anthropic) Format Converter
 * Handles conversion to/from Claude API format
 */

import { deepClone } from '../utils.js';

/**
 * Convert Claude format to OpenAI format
 * @param {Object} claudeRequest - Claude format request
 * @returns {Object} OpenAI format request
 */
export function toOpenAI(claudeRequest) {
    const { messages, system, temperature, max_tokens, ...rest } = claudeRequest;

    // Convert messages to OpenAI format
    const openaiMessages = [];

    // Add system message if present
    if (system) {
        openaiMessages.push({
            role: 'system',
            content: system
        });
    }

    // Add conversation messages
    messages.forEach(msg => {
        openaiMessages.push({
            role: msg.role,
            content: msg.content
        });
    });

    const openaiRequest = {
        messages: openaiMessages
    };

    if (temperature !== undefined) {
        openaiRequest.temperature = temperature;
    }

    if (max_tokens !== undefined) {
        openaiRequest.max_tokens = max_tokens;
    }

    return openaiRequest;
}

/**
 * Convert Claude format to Gemini format
 * @param {Object} claudeRequest - Claude format request
 * @returns {Object} Gemini format request
 */
export function toGemini(claudeRequest) {
    const { messages, system, temperature, max_tokens, ...rest } = claudeRequest;

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

    // Add system instruction if provided (Gemini supports this)
    if (system) {
        geminiRequest.systemInstruction = {
            parts: [{ text: system }]
        };
    }

    if (temperature !== undefined) {
        geminiRequest.generationConfig.temperature = temperature;
    }

    if (max_tokens !== undefined) {
        geminiRequest.generationConfig.maxOutputTokens = max_tokens;
    }

    return geminiRequest;
}

/**
 * Convert OpenAI response to Claude format
 * @param {Object} openaiResponse - OpenAI format response
 * @param {string} model - Model name
 * @returns {Object} Claude format response
 */
export function fromOpenAI(openaiResponse, model = 'claude-3-sonnet-20240229') {
    const choice = openaiResponse.choices?.[0];

    if (!choice) {
        return {
            id: 'msg-' + Date.now(),
            type: 'message',
            role: 'assistant',
            content: [],
            model,
            stop_reason: null,
            usage: {
                input_tokens: 0,
                output_tokens: 0
            }
        };
    }

    const content = choice.message?.content || '';

    return {
        id: 'msg-' + Date.now(),
        type: 'message',
        role: 'assistant',
        content: [
            {
                type: 'text',
                text: content
            }
        ],
        model,
        stop_reason: choice.finish_reason || 'end_turn',
        usage: {
            input_tokens: openaiResponse.usage?.prompt_tokens || 0,
            output_tokens: openaiResponse.usage?.completion_tokens || 0
        }
    };
}

/**
 * Convert Gemini response to Claude format
 * @param {Object} geminiResponse - Gemini format response
 * @param {string} model - Model name
 * @returns {Object} Claude format response
 */
export function fromGemini(geminiResponse, model = 'claude-3-sonnet-20240229') {
    const candidate = geminiResponse.candidates?.[0];

    if (!candidate) {
        return {
            id: 'msg-' + Date.now(),
            type: 'message',
            role: 'assistant',
            content: [],
            model,
            stop_reason: null,
            usage: {
                input_tokens: 0,
                output_tokens: 0
            }
        };
    }

    const content = candidate.content?.parts?.[0]?.text || '';

    return {
        id: 'msg-' + Date.now(),
        type: 'message',
        role: 'assistant',
        content: [
            {
                type: 'text',
                text: content
            }
        ],
        model,
        stop_reason: candidate.finishReason?.toLowerCase() || 'end_turn',
        usage: {
            input_tokens: geminiResponse.usageMetadata?.promptTokenCount || 0,
            output_tokens: geminiResponse.usageMetadata?.candidatesTokenCount || 0
        }
    };
}

/**
 * Convert request to target provider format
 * @param {Object} request - Claude format request
 * @param {string} targetProvider - Target provider name
 * @returns {Object} Converted request
 */
export function convertRequest(request, targetProvider) {
    switch (targetProvider) {
        case 'openai':
            return toOpenAI(request);
        case 'gemini':
            return toGemini(request);
        case 'claude':
        default:
            return deepClone(request);
    }
}

/**
 * Convert response from provider to Claude format
 * @param {Object} response - Provider response
 * @param {string} sourceProvider - Source provider name
 * @param {string} model - Model name
 * @returns {Object} Claude format response
 */
export function convertResponse(response, sourceProvider, model) {
    switch (sourceProvider) {
        case 'openai':
            return fromOpenAI(response, model);
        case 'gemini':
            return fromGemini(response, model);
        case 'claude':
        default:
            return response;
    }
}
