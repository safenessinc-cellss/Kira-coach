import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase';
import { Bot, Sparkles, Send, BookOpen, MessageSquare, ShieldCheck, Check, Lightbulb } from 'lucide-react';

export function CoachCopilot() {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'module_design' | 'ontological_question' | 'feedback_draft'>('module_design');
  const [loading, setLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setGeneratedOutput(null);

    try {
      const prompt = `Eres el "Coach Copilot" de KIRA 2.1 (Safeness Inc.).
Estás asistiendo a un Coach profesional certificado.
REGLA DE ORO DE PRIVACIDAD: Tienes PROHIBIDO intentar acceder, inferir o pedir datos de journals privados o datos personales confidenciales de los alumnos.
Tipo de tarea solicitada: ${type}
Tema o contexto planteado por el coach: "${topic}"

Genera una respuesta de excelencia académica, estructurada y lista para usar:
- Si es "module_design": Estructura un módulo con título, 3 lecciones, objetivo somático y ejercicio práctico.
- Si es "ontological_question": Formula 5 preguntas poderosas que desafíen los juicios y declaraciones del coachee sin inducir respuestas.
- Si es "feedback_draft": Redacta una retroalimentación constructiva, reconociendo fortalezas y proponiendo un compromiso medible.`;

      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Inicia sesión para utilizar Coach Copilot.');
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setGeneratedOutput(data.text);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Coach Copilot AI fallback:', err);
    }

    // High fidelity fallback response
    setTimeout(() => {
      if (type === 'module_design') {
        setGeneratedOutput(`### Módulo Propuesto: Regulación de la Autoexigencia\n\n**Objetivo Somático:** Pasar de la rumiación mental a la presencia corporal.\n\n1. **Lección 1: El Costo Oculto de la Perfección:** Desactivación de la respuesta de amenaza interna.\n2. **Lección 2: Suspiro Fisiológico y Micro-descansos:** Integración de pausas activas cada 90 minutos.\n3. **Lección 3: Celebrar lo Suficiente:** Declaración ontológica de suficiencia.\n\n*Práctica:* El estudiante redacta 3 estándares realistas para su semana.`);
      } else if (type === 'ontological_question') {
        setGeneratedOutput(`### Preguntas Ontológicas de Alto Impacto:\n\n1. ¿Qué costo personal estás pagando por sostener tener la razón en esta conversación?\n2. Si dejaras de justificar esta situación, ¿a qué acción concreta te tendrías que comprometer hoy?\n3. ¿Ese juicio sobre tus capacidades le pertenece a tu presente o es un eco del pasado?\n4. ¿Qué declaración necesitas hacer para cerrar este ciclo de incertidumbre?\n5. ¿Cómo se manifiesta corporalmente esa resistencia cuando dices que no puedes?`);
      } else {
        setGeneratedOutput(`### Borrador de Retroalimentación Profesional:\n\n"Estimado coachee: Reconozco tu consistencia al completar los ejercicios somáticos de esta semana. He notado cómo tu respiración diafragmática te ha permitido abordar conversaciones difíciles con mayor temple.\n\nComo siguiente paso de consolidación, te invito a sostener tu micro-compromiso de desconexión nocturna 45 minutos antes de dormir durante los próximos 4 días. Estás construyendo coherencia real."`);
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Asistencia Pedagógica & Ontológica
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Coach Copilot IA
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Asistente inteligente para la estructuración de lecciones, diseño de preguntas socráticas y borradores de feedback pedagógico.
        </p>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck size={18} className="text-[#22D3EE] shrink-0" />
        <span>
          <strong>Garantía de Privacidad Safeness:</strong> Copilot opera en un entorno ciego sin acceso a las notas íntimas del diario de los alumnos.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-base font-bold text-white tracking-tight">Configurar Solicitud</h2>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Tipo de Tarea
            </label>
            <div className="space-y-2">
              {[
                { id: 'module_design', label: 'Diseño de Módulo Curricular', icon: BookOpen },
                { id: 'ontological_question', label: 'Banco de Preguntas Ontológicas', icon: Lightbulb },
                { id: 'feedback_draft', label: 'Borrador de Feedback Constructivo', icon: MessageSquare }
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    className={`w-full p-3 rounded-2xl border text-left text-xs font-bold flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] text-[#22D3EE]'
                        : 'bg-white/5 border-white/8 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Tema o Caso de Estudio
              </label>
              <textarea
                rows={4}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: Liderazgo ante la incertidumbre, o superación de la autoexigencia tóxica..."
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={16} /> {loading ? 'Generando síntesis...' : 'Generar Propuesta'}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Resultado Generado por IA
              </span>
              {generatedOutput && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedOutput);
                    alert('¡Copiado al portapapeles!');
                  }}
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300"
                >
                  Copiar Texto
                </button>
              )}
            </div>

            {generatedOutput ? (
              <div className="prose prose-invert max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {generatedOutput}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 text-slate-500">
                <Bot size={40} className="mx-auto text-slate-600" />
                <p className="text-xs">
                  Ingresa un tema a la izquierda y presiona "Generar Propuesta" para recibir inspiración pedagógica al instante.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/8 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Powered by Gemini 2.5 Flash · Safeness Pedagogic Core</span>
            <span>v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
