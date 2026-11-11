// All Gemini requests go through the authenticated server proxy.
// Never initialize a Google Generative AI SDK in the browser or expose API keys in VITE_*.
import { generateGemini } from '../lib/gemini';

export async function generarConGemini(prompt: string): Promise<string> {
  return generateGemini({ contents: prompt });
}
