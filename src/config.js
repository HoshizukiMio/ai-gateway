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
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai',
		endpoints: {
			chatCompletions: '/v1/chat/completions',
			completions: '/v1/completions',
			embeddings: '/v1/embeddings',
			models: '/v1/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	gemini: {
		name: 'Google Gemini',
		baseURL: 'https://generativelanguage.googleapis.com',
		authHeader: 'x-goog-api-key',
		authPrefix: '',
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
	},

	mistral: {
		name: 'Mistral AI',
		baseURL: 'https://api.mistral.ai',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format
		endpoints: {
			chatCompletions: '/v1/chat/completions',
			embeddings: '/v1/embeddings',
			models: '/v1/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	cohere: {
		name: 'Cohere',
		baseURL: 'https://api.cohere.ai',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format
		endpoints: {
			chatCompletions: '/v1/chat/completions',
			embeddings: '/v1/embed',
			models: '/v1/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	deepseek: {
		name: 'DeepSeek',
		baseURL: 'https://api.deepseek.com',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format
		endpoints: {
			chatCompletions: '/v1/chat/completions',
			completions: '/v1/completions',
			models: '/v1/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	qwen: {
		name: '阿里云通义千问 (Qwen)',
		baseURL: 'https://dashscope.aliyuncs.com/api',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format
		endpoints: {
			chatCompletions: '/v1/services/aigc/text-generation/generation',
			models: '/v1/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json',
			'X-DashScope-SSE': 'disable'
		}
	},

	glm: {
		name: '智谱AI (ChatGLM)',
		baseURL: 'https://open.bigmodel.cn/api/paas',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format
		endpoints: {
			chatCompletions: '/v4/chat/completions',
			embeddings: '/v4/embeddings',
			models: '/v4/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	ernie: {
		name: '百度文心一言 (ERNIE)',
		baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format (with adapter)
		endpoints: {
			chatCompletions: '/v1/wenxinworkshop/chat/completions',
			embeddings: '/v1/wenxinworkshop/embeddings',
			models: '/v1/wenxinworkshop/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	groq: {
		name: 'Groq',
		baseURL: 'https://api.groq.com/openai',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format
		endpoints: {
			chatCompletions: '/v1/chat/completions',
			models: '/v1/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
		}
	},

	perplexity: {
		name: 'Perplexity AI',
		baseURL: 'https://api.perplexity.ai',
		authHeader: 'Authorization',
		authPrefix: 'Bearer ',
		nativeFormat: 'openai', // Uses OpenAI-compatible format
		endpoints: {
			chatCompletions: '/chat/completions',
			models: '/models'
		},
		requiredHeaders: {
			'Content-Type': 'application/json'
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
	claude: 'claude-3-sonnet-20240229',
	mistral: 'mistral-medium',
	cohere: 'command',
	deepseek: 'deepseek-chat',
	qwen: 'qwen-turbo',
	glm: 'glm-4',
	ernie: 'ernie-bot-turbo',
	groq: 'llama2-70b-4096',
	perplexity: 'llama-3.1-sonar-small-128k-online'
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
