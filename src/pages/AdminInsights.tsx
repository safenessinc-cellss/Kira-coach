import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase';
import { Lightbulb, Sparkles, TrendingUp, AlertTriangle, Users, ArrowRight, RefreshCw } from 'lucide-react';

export function AdminInsights() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Hoy, 09:30 AM');
  const [insights, setInsights] = useState<{
    summary: string;
    opportunities: string[];
    risks: string[];
    actionItems: string[];
  }>({
    summary: 'La cohorte de alumnos que completan el Protocolo de Calma en sus primeros 3 días muestra un 42% más de retención semanal (WAU) y un 35% mayor tasa de graduación en programas ontológicos.',
    opportunities: [
      'Empaquetar el módulo de "Mandalas Fractales" como beneficio corporativo B2B para reducir el burnout laboral.',
      'Aumentar el límite de alumnos por cohorte en los cursos de la Dra. Elena Rostova ante la alta demanda y 4.95 de satisfacción.'
    ],
    risks: [
      'Un 14% de alumnos en nivel Bronce no ha realizado su primer check-in somático tras 7 días de inscripción.',
      'Concentración de liquidaciones pendientes en fines de semana: se recomienda programar pagos quincenales automatizados.'
    ],
    actionItems: [
      'Activar un Kira Nudge contextual de bienvenida con el Protocolo de Calma guiado para nuevos ingresos.',
      'Emitir recordatorios socráticos automatizados a usuarios con racha inactiva mayor a 5 días.'
    ]
  });

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Inicia sesión como administrador.');
      const res = await fetch('/api/ai/business-insights', { method: 'POST', headers: { Authorization: `Bearer ${idToken}` } });
      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setInsights(prev => ({
            ...prev,
            summary: data.summary,
            opportunities: data.opportunities || prev.opportunities,
            risks: data.risks || prev.risks,
            actionItems: data.actionItems || prev.actionItems
          }));
        }
      }
    } catch (e) {
      console.warn("Could not refresh business insights:", e);
    }
    setLastUpdated('Actualizado hace un instante');
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#22D3EE] uppercase">
            Analítica Predictiva Ejecutiva
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Business Insights IA
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-1">
            Diagnósticos algorítmicos generados por la IA de Safeness para optimizar la retención, conversión y salud energética de los usuarios.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider self-start transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Calculando...' : 'Regenerar Diagnóstico'}
        </button>
      </div>

      {/* Hero Summary Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border-[#22D3EE]/30 bg-[#22D3EE]/5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#22D3EE] mb-3">
          <Sparkles size={16} /> Diagnóstico Estratégico · Caché 1h ({lastUpdated})
        </div>

        <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
          "{insights.summary}"
        </p>
      </div>

      {/* Grid of Opportunities and Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <TrendingUp size={16} /> Oportunidades Clave
          </div>
          <ul className="space-y-3">
            {insights.opportunities.map((op, i) => (
              <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span>{op}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-amber-500/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
            <AlertTriangle size={16} /> Fricciones Detectadas
          </div>
          <ul className="space-y-3">
            {insights.risks.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-[#7C5CFF]/20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
            <Lightbulb size={16} /> Plan de Acción Recomendado
          </div>
          <ul className="space-y-3">
            {insights.actionItems.map((a, i) => (
              <li key={i} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF] shrink-0 mt-1.5" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
