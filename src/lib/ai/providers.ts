import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';

export function getProvider(provider: string) {
  switch (provider) {
    case 'groq':
      return createGroq({ apiKey: process.env.GROQ_API_KEY });
    case 'google':
      return createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
    case 'openrouter':
      return createOpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      });
    default:
      return createGroq({ apiKey: process.env.GROQ_API_KEY });
  }
}

export function getModel(provider: string, modelId: string) {
  const providerInstance = getProvider(provider);
  return providerInstance(modelId);
}
