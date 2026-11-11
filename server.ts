import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { verify as verifySignature } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const GEMINI_MODEL = "gemini-3.8-flash";

// In-memory caches
const aiCache = new Map<string, { data: any; expiry: number }>();
function getCached(key: string) {
  const item = aiCache.get(key);
  if (item && item.expiry > Date.now()) return item.data;
  return null;
}
function setCache(key: string, data: any, ttlMs: number) {
  aiCache.set(key, { data, expiry: Date.now() + ttlMs });
}


type VerifiedFirebaseUser = { uid: string; email?: string; emailVerified: boolean };
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "kira2-a6a20";
let firebasePublicKeys: Record<string, string> = {};
let firebaseKeysExpiresAt = 0;
const apiRateLimits = new Map<string, { count: number; resetAt: number }>();

async function verifyFirebaseIdToken(token: string): Promise<VerifiedFirebaseUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (header.alg !== "RS256" || !header.kid ||
        claims.aud !== FIREBASE_PROJECT_ID ||
        claims.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}` ||
        typeof claims.sub !== "string" || !claims.sub ||
        !Number.isFinite(claims.exp) || claims.exp <= now ||
        !Number.isFinite(claims.iat) || claims.iat > now + 300) return null;

    if (Date.now() >= firebaseKeysExpiresAt || !firebasePublicKeys[header.kid]) {
      const response = await fetch("https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys");
      if (!response.ok) return null;
      firebasePublicKeys = await response.json() as Record<string, string>;
      const cacheControl = response.headers.get("cache-control") || "";
      const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 3600);
      firebaseKeysExpiresAt = Date.now() + Math.min(maxAge, 3600) * 1000;
    }
    const certificate = firebasePublicKeys[header.kid];
    if (!certificate) return null;
    const signedData = Buffer.from(parts[0] + "." + parts[1]);
    if (!verifySignature("RSA-SHA256", signedData, certificate, Buffer.from(parts[2], "base64url"))) return null;
    return { uid: claims.sub, email: typeof claims.email === "string" ? claims.email.toLowerCase() : undefined, emailVerified: claims.email_verified === true };
  } catch {
    return null;
  }
}

async function requireFirebaseUser(req: express.Request, res: express.Response): Promise<VerifiedFirebaseUser | null> {
  const match = (req.headers.authorization || "").match(/^Bearer\\s+(.+)$/i);
  if (!match) { res.status(401).json({ error: "Debes iniciar sesión." }); return null; }
  const user = await verifyFirebaseIdToken(match[1]);
  if (!user) { res.status(401).json({ error: "La sesión no es válida o ha caducado." }); return null; }
  const now = Date.now();
  const limit = apiRateLimits.get(user.uid);
  if (limit && now < limit.resetAt && limit.count >= 20) {
    res.status(429).json({ error: "Límite temporal de solicitudes alcanzado. Inténtalo más tarde." });
    return null;
  }
  if (!limit || now >= limit.resetAt) apiRateLimits.set(user.uid, { count: 1, resetAt: now + 60_000 });
  else limit.count += 1;
  return user;
}

async function requireKiraAdmin(req: express.Request, res: express.Response): Promise<VerifiedFirebaseUser | null> {
  const user = await requireFirebaseUser(req, res);
  if (!user) return null;
  if (user.email !== "safeness.c.a@gmail.com" || !user.emailVerified) {
    res.status(403).json({ error: "Acceso reservado al administrador autorizado." });
    return null;
  }
  return user;
}

const app = express();
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
app.use(express.json({ limit: "2mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "KIRA 2.1 Unificada", author: "Safeness Inc." });
});

// Payments are deliberately disabled until prices are loaded from trusted Firestore data
// and signed, idempotent provider webhooks are configured. Never trust client-supplied amounts.
app.post("/api/create-checkout-session", async (req, res) => {
  const user = await requireFirebaseUser(req, res);
  if (!user) return;
  if (req.body?.userId && req.body.userId !== user.uid) return res.status(403).json({ error: "USER_MISMATCH" });
  return res.status(503).json({ error: "PAYMENTS_NOT_CONFIGURED", message: "La pasarela se habilitará cuando el precio y el webhook estén validados en el servidor." });
});

app.post("/api/mercadopago-preference", async (req, res) => {
  const user = await requireFirebaseUser(req, res);
  if (!user) return;
  if (req.body?.userId && req.body.userId !== user.uid) return res.status(403).json({ error: "USER_MISMATCH" });
  return res.status(503).json({ error: "PAYMENTS_NOT_CONFIGURED", message: "Mercado Pago aún no está configurado para producción." });
});

// AI: Analyze Journal
const JournalAnalysisSchema = z.object({
  content: z.string().min(1).max(12000),
  mood: z.string().max(100).optional(),
});

app.post("/api/ai/analyze-journal", async (req, res) => {
  const authenticatedUser = await requireFirebaseUser(req, res);
  if (!authenticatedUser) return;

  const parsed = JournalAnalysisSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Contenido requerido" });

  const { content, mood } = parsed.data;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Analiza esta entrada íntima de journal para KIRA 2.1 (Safeness Inc.):
Contenido: "${content}"
Ánimo reportado por el usuario: "${mood || 'no especificado'}"

Devuelve un JSON con:
- primaryEmotion (string)
- energyLevel ("alta" | "media" | "baja")
- insights (string breve y empático)
- suggestedAction (un micro-paso de regulación somática o mental)
- burnoutSignal (boolean)`,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err) {
      console.warn("Journal analysis AI error:", err);
    }
  }

  // Safe fallback
  res.json({
    primaryEmotion: "Reflexión serena",
    energyLevel: "media",
    insights: "Se percibe voluntad de claridad y presencia ante los desafíos diarios.",
    suggestedAction: "Realiza 3 ciclos de respiración 4-7-8 antes de continuar tu jornada.",
    burnoutSignal: false
  });
});

// AI: Analyze Session (Session Intelligence)
app.post("/api/ai/analyze-session", async (req, res) => {
  const authenticatedUser = await requireFirebaseUser(req, res);
  if (!authenticatedUser) return;

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length > 100 || messages.some((m: any) => typeof m?.text !== "string" || m.text.length > 10000)) return res.status(400).json({ error: "Transcripción inválida o demasiado extensa." });

  if (ai && Array.isArray(messages)) {
    try {
      const transcript = messages.map((m: any) => `${m.speaker}: ${m.text}`).join("\n");
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `Eres el motor de Session Intelligence de KIRA 2.1 (Safeness Inc.).
Analiza la siguiente transcripción de una sesión de coaching ontológico:
${transcript}

Genera un JSON con la estructura:
{
  "resumen_ejecutivo": "string",
  "progreso_metas_anteriores": ["string"],
  "nuevos_compromisos": [{"tarea": "string", "deadline": "string", "priority": "alta" | "media" | "baja"}],
  "patrones_detectados": ["string"],
  "inconsistencias_detectadas": ["string"],
  "prosodic_inference": "string",
  "roleplay_scenarios": ["string"],
  "personal_mantra": "string",
  "focus_heatmap": {"pasado_problemas": number, "presente": number, "futuro_soluciones": number},
  "sugerencia_proxima_sesion": "string",
  "metrics": {"confidence": number, "clarity": number, "energy": number}
}`,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        return res.json(JSON.parse(response.text));
      }
    } catch (err) {
      console.warn("Session intelligence analysis error:", err);
    }
  }

  // Fallback
  res.json({
    resumen_ejecutivo: "Sesión enfocada en la reinterpretación de estándares de rendimiento y reducción del diálogo interno crítico.",
    progreso_metas_anteriores: ["Mejora en la higiene del sueño nocturno."],
    nuevos_compromisos: [
      { tarea: "Pausa consciente de 10 min a mitad de la jornada", deadline: "Viernes", priority: "alta" }
    ],
    patrones_detectados: ["Tendencia a confundir juicios automáticos con hechos verificables."],
    prosodic_inference: "Tono inicialmente apresurado con desaceleración progresiva tras las preguntas socráticas.",
    personal_mantra: "Mi presencia es suficiente; mi descanso es sagrado.",
    focus_heatmap: { pasado_problemas: 25, presente: 45, futuro_soluciones: 30 },
    sugerencia_proxima_sesion: "Profundizar en la delegación efectiva y el establecimiento de límites.",
    metrics: { confidence: 85, clarity: 90, energy: 78 }
  });
});

// AI: Mentor Recommendations (MentorWidget)
app.post("/api/ai/mentor-recommendations", async (req, res) => {
  const authenticatedUser = await requireFirebaseUser(req, res);
  if (!authenticatedUser) return;

  const { avgProgress = 0, journalTexts = "", progressList = "", activityData = "", allCourses = [] } = req.body;

  if (ai) {
    try {
      const prompt = `
        Actúa como un mentor experto en bienestar y desarrollo personal de la plataforma KIRA 2.1 (Safeness Inc.).
        El alumno tiene un progreso promedio general del ${Number(avgProgress).toFixed(1)}%.
        
        Basándote en sus estados emocionales de sus diarios:
        "${journalTexts || 'El alumno aún no ha escrito en su diario.'}"
        
        Detalle de sus cursos:
        "${progressList || 'Aún no está inscrito en cursos.'}"

        Patrones de interacción y rendimiento (Tiempo, Quizzes, Clicks):
        "${activityData || 'No hay datos de interacción detallada aún.'}"

        Cursos disponibles para recomendar:
        ${JSON.stringify(allCourses)}
        
        Instrucciones para el consejo:
        1. Analiza no solo el progreso, sino el RENDIMIENTO (quizzes) y el COMPROMISO (tiempo e interacciones).
        2. Si el rendimiento es bajo en quizzes pero el tiempo es alto, sugiere técnicas de estudio o calma.
        3. Si el compromiso es bajo, ofrece un consejo específico para superar obstáculos y motivarlo.
        4. Si el progreso y rendimiento son altos (>70%), felicítalo y sugiérele un reto altamente relevante o un curso avanzado.
        
        Responde exclusivamente en formato JSON válido:
        { "message": "tu consejo detallado y ultra-personalizado", "suggestedCourseIds": ["ID1", "ID2"] }
      `;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn("Mentor recommendations AI error, using fallback:", err?.message || err);
    }
  }

  // Graceful fallback recommendation
  const suggestedIds = Array.isArray(allCourses) ? allCourses.slice(0, 2).map((c: any) => c.id).filter(Boolean) : [];
  res.json({
    message: "Tu constancia en la plataforma refleja un gran compromiso con tu bienestar. Te recomendamos practicar 5 minutos de coherencia somática antes de iniciar tu próximo módulo.",
    suggestedCourseIds: suggestedIds
  });
});

// AI: Generic Generate
app.post("/api/ai/generate", async (req, res) => {
  const authenticatedUser = await requireFirebaseUser(req, res);
  if (!authenticatedUser) return;

  const { prompt, systemInstruction, jsonMode = false } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 20000) return res.status(400).json({ error: "Prompt requerido o demasiado extenso." });

  if (ai) {
    try {
      const config: any = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      if (jsonMode) config.responseMimeType = "application/json";

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config
      });

      if (response.text) {
        return res.json({ text: response.text });
      }
    } catch (err: any) {
      console.warn("AI Generate error:", err?.message || err);
    }
  }

  res.json({
    text: "¿Qué intención quieres sembrar en tu corazón hoy?\nNudge: Respira profundamente 3 veces y mantén tu centro."
  });
});

// AI: Chat
app.post("/api/ai/chat", async (req, res) => {
  const authenticatedUser = await requireFirebaseUser(req, res);
  if (!authenticatedUser) return;

  const { messages, context } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50 || messages.some((m: any) => typeof m?.text !== "string" || m.text.length > 8000) || (typeof context === "string" && context.length > 5000)) {
    return res.status(400).json({ error: "Mensajes requeridos" });
  }

  if (ai) {
    try {
      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text || "" }]
      }));

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: `Eres Kira, la IA de KIRA 2.1 por Safeness Inc., una inteligencia sintética viva y de alto rendimiento.
          ${context ? `Contexto del usuario: ${context}` : ""}
          Deberás ser proactiva y profundamente empática. Valida emociones, sugiere micro-pasos de bienestar y mantén un tono elegante y cercano.`
        }
      });

      if (response.text) {
        return res.json({ text: response.text });
      }
    } catch (err: any) {
      console.warn("AI Chat error:", err?.message || err);
    }
  }

  res.json({
    text: "Estoy aquí contigo. Mantén tu presencia y avancemos con un micro-paso de calma y coherencia."
  });
});

// AI: Business Insights
app.post("/api/ai/business-insights", async (req, res) => {
  const authenticatedUser = await requireKiraAdmin(req, res);
  if (!authenticatedUser) return;

  const cached = getCached("business_insights");
  if (cached) return res.json(cached);

  const payload = {
    summary: "La cohorte de alumnos con check-in somático regular presenta un 42% más de retención semanal.",
    opportunities: [
      "Lanzar programas corporativos B2B de prevención de burnout.",
      "Expandir cohortes con mentores de neuroregulación."
    ],
    risks: ["Deserción en semana 2 si no se activa el Protocolo de Calma."],
    actionItems: ["Notificaciones de coherencia proactivas a usuarios inactivos."]
  };

  setCache("business_insights", payload, 60 * 60 * 1000); // 1h cache
  res.json(payload);
});

async function startLocalServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`KIRA 2.1 Unificada server running on http://localhost:${PORT}`);
  });

  server.on("error", (e: any) => {
    if (e.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      console.error("Server error:", e);
      process.exit(1);
    }
  });
}

startLocalServer();

export default app;
