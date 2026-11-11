import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Wind, Heart, Sparkles, AlertTriangle, ShieldCheck, Moon, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CalmProtocolModal } from '../components/CalmProtocolModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function StudentWellness() {
  const { user } = useAuth();
  const [calmModalOpen, setCalmModalOpen] = useState(false);
  const [triggerReason, setTriggerReason] = useState<string | undefined>(undefined);

  const burnoutRisk = user?.burnoutScore || 24;
  const isHighRisk = burnoutRisk > 60;

  const weeklyTrendData = [
    { day: 'Lun', energia: 75, estres: 40 },
    { day: 'Mar', energia: 82, estres: 35 },
    { day: 'Mié', energia: 68, estres: 55 },
    { day: 'Jue', energia: 88, estres: 28 },
    { day: 'Vie', energia: 80, estres: 30 },
    { day: 'Sáb', energia: 92, estres: 15 },
    { day: 'Dom', energia: 90, estres: 18 },
  ];

  const handleEmergencyProtocol = (reason: string) => {
    setTriggerReason(reason);
    setCalmModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Anticipatory Warning or Equilibrium Status */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-white/10 bg-gradient-to-r from-slate-900 via-[#0B0F17] to-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#22D3EE]/10 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-xs font-bold tracking-wider uppercase">
              <Heart size={14} /> Hub de Bienestar Adaptativo
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Monitoreo Biopsicosocial & Calma
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              Algoritmos de detección anticipatoria entrenados para advertir sobrecarga cognitiva y estrés antes de que se convierta en burnout.
            </p>
          </div>

          <button
            onClick={() => handleEmergencyProtocol('Activación voluntaria de descompresión')}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#22D3EE] to-[#7C5CFF] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all shrink-0"
          >
            <Wind size={18} /> Protocolo de Calma Inmediata
          </button>
        </div>
      </div>

      {/* Grid of Key Anticipatory Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Burnout Risk Card */}
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Riesgo de Burnout
            </span>
            <div className={`p-2 rounded-xl ${isHighRisk ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isHighRisk ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black font-mono text-white">
              {burnoutRisk}%
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {isHighRisk ? 'Elevado' : 'Zona Óptima / Baja'}
            </span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden my-3">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${isHighRisk ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-[#22D3EE]'}`}
              style={{ width: `${burnoutRisk}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Basado en la frecuencia de registros somáticos, descansos respetados y modulación del lenguaje.
          </p>
        </div>

        {/* Weekly Great Victory (Gran Victoria) */}
        <div className="glass-panel p-6 rounded-3xl border-[#7C5CFF]/20 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C5CFF]">
              Gran Victoria Semanal
            </span>
            <div className="p-2 rounded-xl bg-[#7C5CFF]/20 text-[#7C5CFF]">
              <Sparkles size={18} />
            </div>
          </div>

          <h3 className="text-base font-bold text-white mb-2 leading-snug">
            "Priorizaste el descanso sin culpa"
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            La IA detectó que pausaste tus actividades tras 90 minutos de foco continuo, elevando tu índice de coherencia semanal un +18%.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-[#22D3EE] font-bold">
            <CheckCircle2 size={14} /> Consolidado en tu racha
          </div>
        </div>

        {/* Master Challenge (Desafío Maestro) */}
        <div className="glass-panel p-6 rounded-3xl border-amber-500/20 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Desafío Maestro
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Activity size={18} />
            </div>
          </div>

          <h3 className="text-base font-bold text-white mb-2 leading-snug">
            Cierre Digital Nocturno
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tu mayor vector de fricción energética ocurre entre las 22:30 y las 23:45. Apaga pantallas 45 min antes de dormir durante 3 días.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-amber-300 font-bold">
            <Moon size={14} /> Recompensa: +75 Energy Pts
          </div>
        </div>
      </div>

      {/* Biopsychosocial Rhythm Chart */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Curva de Energía Vital vs. Estrés
            </h3>
            <p className="text-xs text-slate-400">
              Trazabilidad de tus últimos 7 días evaluada mediante micro-check-ins y registros de journal.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#22D3EE]" />
              <span className="text-slate-300">Energía Vital</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#7C5CFF]" />
              <span className="text-slate-300">Nivel de Estrés</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrendData}>
              <defs>
                <linearGradient id="vitalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }} 
              />
              <Area type="monotone" dataKey="energia" stroke="#22D3EE" strokeWidth={2.5} fillOpacity={1} fill="url(#vitalGrad)" />
              <Area type="monotone" dataKey="estres" stroke="#7C5CFF" strokeWidth={2.5} fillOpacity={1} fill="url(#stressGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CalmProtocolModal
        isOpen={calmModalOpen}
        onClose={() => setCalmModalOpen(false)}
        triggerReason={triggerReason}
      />
    </div>
  );
}
