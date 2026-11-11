import { auth } from '../firebase';

/**
 * KIRA 2.1 - Client AI Proxy helper
 * Routes AI calls securely to server-side endpoints on Node.js (/api/ai/*)
 * avoiding client-side proxy restrictions and exposing no secret keys.
 * © 2026 Safeness Inc.
 */

export async function generateContentServer(
  prompt: string, 
  jsonMode: boolean = false, 
  systemInstruction?: string
): Promise<string> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) return '';
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ prompt, jsonMode, systemInstruction })
    });

    if (res.ok) {
      const data = await res.json();
      return data.text || '';
    }
  } catch (e) {
    console.warn('AI client proxy call failed, graceful fallback applied:', e);
  }
  return '';
}
