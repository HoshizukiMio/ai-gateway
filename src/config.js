/**
 * AI Gateway Configuration
 * 
 * This file defines all supported AI providers and their configurations.
 * Add new providers here to extend the gateway's capabilities.
 */

export const PROVIDERS = {
	openai: {
		name: 'OpenAI',
		baseURL: 'https://api.openai.com',
		authHeader: 'Authorization', // Uses "Bearer {key}" format
		authPrefix: 'Bearer ',
		nativeFormat: 'openai',
		endpoints: {
			chatCompletions: '/v1/chat/completions',
			completions: '/v1/completions',
			embeddings: '/v1/embeddings',
			models: '/v1/models'
		},
		// Headers required for requests
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	gemini: {
		name: 'Google Gemini',
		baseURL: 'https://generativelanguage.googleapis.com',
		authHeader: 'x-goog-api-key', // API key passed as header
		authPrefix: '', // No prefix needed
		nativeFormat: 'gemini',
		endpoints: {
			generateContent: '/v1beta/models/{model}:generateContent',
			streamGenerateContent: '/v1beta/models/{model}:streamGenerateContent',
			embedContent: '/v1beta/models/{model}:embedContent'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	claude: {
		name: 'Anthropic Claude',
		baseURL: 'https://api.anthropic.com',
		authHeader: 'x-api-key',
		authPrefix: '',
		nativeFormat: 'claude',
		endpoints: {
			messages: '/v1/messages'
		},
		requiredHeaders: {
			'Content-Type': 'application/json',
			'anthropic-version': '2023-06-01'
		}
	}
};

// Supported request formats
export const FORMATS = {
	openai: 'openai',
	gemini: 'gemini',
	claude: 'claude'
};

// Default models for each provider when not specified
export const DEFAULT_MODELS = {
	openai: 'gpt-3.5-turbo',
	gemini: 'gemini-pro',
	claude: 'claude-3-sonnet-20240229'
};

/**
 * Get provider configuration by name
 * @param {string} providerName - Provider name
 * @returns {Object|null} Provider configuration
 */
export function getProvider(providerName) {
	return PROVIDERS[providerName.toLowerCase()] || null;
}

/**
 * Check if a format is supported
 * @param {string} format - Format name
 * @returns {boolean}
 */
export function isValidFormat(format) {
	return Object.keys(FORMATS).includes(format.toLowerCase());
}

/**
 * Check if a provider is supported
 * @param {string} provider - Provider name
 * @returns {boolean}
 */
export function isValidProvider(provider) {
	return Object.keys(PROVIDERS).includes(provider.toLowerCase());
}

/**
 * Get all supported providers
 * @returns {string[]} Array of provider names
 */
export function getAllProviders() {
	return Object.keys(PROVIDERS);
}

/**
 * Get all supported formats
 * @returns {string[]} Array of format names
 */
export function getAllFormats() {
	return Object.keys(FORMATS);
}
