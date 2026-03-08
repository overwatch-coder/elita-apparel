import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText, gateway } from "ai";

/**
 * AI Service Configuration
 *
 * ENVIRONMENT VARIABLES REQUIRED:
 * - AI_GATEWAY_API_KEY: (optional, uses Vercel AI Gateway if present)
 * - AI_SERVICE_TYPE: 'openai' | 'gemini' (preferred fallback)
 * - OPENAI_API_KEY: (required for openai)
 * - GOOGLE_GENERATIVE_AI_API_KEY: (required for gemini)
 */

const serviceType = (process.env.AI_SERVICE_TYPE || "openai").toLowerCase();
const gatewayApiKey = process.env.AI_GATEWAY_API_KEY;

// Initialize Providers
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

/**
 * Get the active model based on the service type or gateway
 */
export function getModel(type?: string) {
  const currentType = type || serviceType;

  // Use Gateway if available and no specific type requested
  if (gatewayApiKey && !type) {
    // Note: Gateway uses provider/model format
    // Defaulting to gpt-4o-mini via gateway
    return gateway("openai/gpt-4o-mini");
  }

  if (currentType === "gemini") {
    return google("gemini-1.5-pro");
  }

  // Default to OpenAI
  return openai("gpt-4o-mini");
}

/**
 * Unified text generation function with fallback logic
 */
export async function aiGenerateText({
  prompt,
  system,
  temperature = 0.7,
  maxTokens = 1000,
}: {
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  // Try sequence: Gateway -> Primary (OpenAI/Gemini) -> Secondary
  const attemptOrder = gatewayApiKey
    ? ["gateway", serviceType, serviceType === "openai" ? "gemini" : "openai"]
    : [serviceType, serviceType === "openai" ? "gemini" : "openai"];

  let lastError = null;

  for (const provider of attemptOrder) {
    try {
      const model = provider === "gateway" ? getModel() : getModel(provider);

      const result = await generateText({
        model,
        system,
        prompt,
        temperature,
        maxOutputTokens: maxTokens,
      });

      return {
        text: result.text,
        error: null,
        usage: result.usage,
        providerUsed: provider,
      };
    } catch (error: any) {
      console.warn(`AI Generation failed for ${provider}:`, error.message);
      lastError = error;
      // Continue to next provider in sequence
    }
  }

  console.error("All AI providers failed:", lastError);
  return { text: "", error: lastError?.message || "All AI providers failed" };
}

/**
 * Unified streaming text generation function
 * Note: Streaming fallback is more complex; here we just use the best available provider
 */
export async function aiStreamText({
  prompt,
  system,
  temperature = 0.7,
}: {
  prompt: string;
  system?: string;
  temperature?: number;
}) {
  const model = getModel();

  return streamText({
    model,
    system,
    prompt,
    temperature,
  });
}
