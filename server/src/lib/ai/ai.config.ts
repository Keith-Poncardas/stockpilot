import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '';

export const googleProvider = createGoogleGenerativeAI({
    apiKey: googleApiKey,
});

export type SupportedAiProvider = 'google' | 'openai';

export function getAiProviderName(): SupportedAiProvider {
    return (process.env.AI_PROVIDER as SupportedAiProvider) || 'google';
}

export function isAiConfigured(): boolean {
    const provider = getAiProviderName();
    if (provider === 'google') {
        return Boolean(googleApiKey && googleApiKey.trim().length > 0);
    }
    return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
}

export function getDefaultAiModel(): LanguageModel {
    // Default to Gemini 3.6 Flash (high speed, current stable model for structured outputs)
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    return googleProvider(modelName);
}
