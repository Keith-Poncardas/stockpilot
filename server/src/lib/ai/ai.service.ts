import { generateObject, type LanguageModel } from 'ai';
import type { z } from 'zod';
import { getDefaultAiModel, isAiConfigured } from './ai.config';

export interface GenerateStructuredOptions<T> {
    schema: z.ZodSchema<T>;
    system?: string;
    prompt: string;
    model?: LanguageModel;
    temperature?: number;
    fallback?: () => T;
}

export class AiService {
    /**
     * Generates a strongly typed structured object using Vercel AI SDK.
     * Automatically handles missing API keys or API failures if a fallback is provided.
     */
    async generateStructured<T>(options: GenerateStructuredOptions<T>): Promise<T> {
        const {
            schema,
            system,
            prompt,
            model = getDefaultAiModel(),
            temperature = 0.2,
            fallback,
        } = options;

        if (!isAiConfigured()) {
            if (fallback) {
                return fallback();
            }
            throw new Error(
                'AI service is not configured with an active API key. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment.'
            );
        }

        try {
            const { object } = await generateObject({
                model,
                schema,
                system,
                prompt,
                temperature,
            });

            return object;
        } catch (error) {
            console.error('[AiService] Failed to generate structured response from AI model:', error);
            if (fallback) {
                console.warn('[AiService] Falling back to deterministic computation.');
                return fallback();
            }
            throw error;
        }
    }
}

export const aiService = new AiService();
