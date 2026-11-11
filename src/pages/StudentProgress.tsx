import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { EnergyTierBadge, getTierInfo } from '../components/EnergyTierBadge';
import { SEED_CONSCIOUSNESS_BADGES } from '../lib/seedData';
import { Award, Zap, ShieldCheck, Star, Sparkles, Moon, Wind, CheckCircle2, Lock } from 'lucide-react';

export function StudentProgress() {
  const { user } = useAuth();
  const points = user?.points || 1250;
  const currentTierInfo = getTierInfo(points);

  const [badges, setBadges] = useState(SEED_CONSCIOUSNESS_BADGES);

  const tiers = [
    { name: 'Bronce', min: 0, max: 500, perk: 'Acceso a Plan Maestro y Journaling IA diario' },
    { name: 'Plata', min: 501, max: 1500, perk: 'Desbloqueo de Bóveda Élite y Mandalas Fractales' },
    { name: 'Oro', min: 1501, max: 5000, perk: 'Sesiones 1-a-1 de mentoría y Certificados Verificados' },
    { name: 'Platino', min: 5001, max: 10000, perk: 'Maestría Vital, Masterclasses VIP y Soporte Prioritario' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Evolución & Trascendencia
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Progreso y Medallas de Consciencia
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Tu evolución en KIRA 2.1 no se premia por el tiempo que pasas frente a la pantalla, sino por tu coherencia somática, descansos de calidad y compromisos cumplidos.
        </p>
      </div>

      {/* Energy Tier Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border-[#7C5CFF]/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C5CFF]/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Rango Actual del Estudiante
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Nivel {currentTierInfo.tier}
              </h2>
              <EnergyTierBadge points={points} />
            </div>
            <p className="text-xs text-slate-300">
              {currentTierInfo.nextTierPoints !== Infinity
                ? `Te faltan ${currentTierInfo.nextTierPoints - points} puntos para el siguiente umbral.`
                : '¡Has alcanzado la máxima distinción energética!'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0 min-w-[180px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Racha de Coherencia
            </span>
            <span className="text-3xl font-black font-mono text-[#22D3EE]">
              {user?.consciousnessStreak || 6} días
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              ✓ Ritmo circadiano alineado
            </span>
          </div>
        </div>

        {/* Tiers Ladder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {tiers.map((t) => {
            const isReached = points >= t.min;
            const isCurrent = currentTierInfo.tier === t.name;

            return (
              <div
                key={t.name}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent 
                    ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] shadow-[0_0_20px_rgba(124,92,255,0.2)]'
                    : isReached 
                    ? 'bg-white/5 border-emerald-500/30' 
                    : 'bg-white/2 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{t.name}</span>
                  {isReached ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : (
                    <Lock size={14} className="text-slate-500" />
                  )}
                </div>
                <p className="text-[11px] font-mono text-slate-400 mb-2">
                  {t.min} - {t.max === 10000 ? '+5000' : t.max} Pts
                </p>
                <p className="text-xs text-slate-300 leading-snug">
                  {t.perk}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consciousness Badges Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Medallas de Consciencia (Antiadictivas)
          </h2>
          <p className="text-xs text-slate-400">
            Inspiradas en la filosofía de bienestar de kira.coach. No premian el scroll ni el consumo pasivo; premian el autocuidado genuino.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b) => {
            const isUnlocked = b.progress >= 100;
            const Icon = b.category === 'rest' ? Moon : b.category === 'commitment' ? ShieldCheck : b.category === 'mindfulness' ? Wind : Sparkles;

            return (
              <div
                key={b.id}
                className={`glass-panel p-6 rounded-3xl border transition-all ${
                  isUnlocked ? 'border-[#22D3EE]/30 bg-[#22D3EE]/5' : 'border-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isUnlocked ? 'bg-[#22D3EE]/20 text-[#22D3EE]' : 'bg-white/5 text-slate-400'
                  }`}>
                    <Icon size={24} />
                  </div>
                  {isUnlocked && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                      Desbloqueada
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{b.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {b.description}
                </p>

                <div className="space-y-1.5 mt-auto">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Progreso</span>
                    <span className="text-white font-bold">{b.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-[#22D3EE]' : 'bg-[#7C5CFF]'
                      }`}
                      style={{ width: `${b.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
