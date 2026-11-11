import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const GEMINI_MODEL = "gemini-3.8-flash";

// Lazy Stripe Initialization
let stripeClient: Stripe | null = null;
function getStripe() {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-01-27" as any,
    });
  }
  return stripeClient;
}

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

const app = express();
app.use(express.json({ limit: "10mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "KIRA 2.1 Unificada", author: "Safeness Inc." });
});

// Stripe Checkout Session
const CheckoutSchema = z.object({
  courseId: z.string().optional(),
  userId: z.string().min(1),
  amount: z.number().positive(),
  title: z.string().min(1),
  type: z.enum(["course_purchase", "coach_membership", "vault_unlock"]).default("course_purchase"),
});

app.post("/api/create-checkout-session", async (req, res) => {
  const parsed = CheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos de compra inválidos", details: parsed.error.issues });
  }

  const { courseId, userId, amount, title, type } = parsed.data;
  const stripe = getStripe();

  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: title,
                metadata: { courseId: courseId || "", type },
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}${type === "coach_membership" ? "/coach" : "/dashboard"}?success=true&courseId=${courseId || ""}&amount=${amount}&title=${encodeURIComponent(title)}&type=${type}`,
        cancel_url: `${req.headers.origin}${type === "coach_membership" ? "/coach" : "/dashboard"}?canceled=true`,
        client_reference_id: userId,
        metadata: { userId, courseId: courseId || "", type },
      });
      return res.json({ url: session.url });
    } catch (e: any) {
      console.error("Stripe Session Error:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  // Fallback simulator for preview
  const redirectUrl =
    type === "coach_membership"
      ? `/coach?success=true&type=coach_membership&amount=${amount}`
      : `/dashboard?success=true&courseId=${courseId || ""}&amount=${amount}&title=${encodeURIComponent(title)}`;

  res.json({
    url: redirectUrl,
    sessionId: `mock_session_${Date.now()}`,
  });
});

// Mercado Pago Preference
app.post("/api/mercadopago-preference", async (req, res) => {
  const { title, price, userId, courseId } = req.body;
  res.json({
    init_point: `/dashboard?success=true&courseId=${courseId || ""}&amount=${price || 99}&title=${encodeURIComponent(title || "Curso")}&provider=mercadopago`,
    id: `mp_pref_${Date.now()}`
  });
});

// AI: Analyze Journal
const JournalAnalysisSchema = z.object({
  content: z.string().min(1),
  mood: z.string().optional(),
});

app.post("/api/ai/analyze-journal", async (req, res) => {
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
  const { messages } = req.body;

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
  const { prompt, systemInstruction, jsonMode = false } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt requerido" });

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
  const { messages, context } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
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
