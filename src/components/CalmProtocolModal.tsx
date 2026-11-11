import React, { useState, useEffect } from 'react';
import { X, Wind, MessageCircleHeart, BellOff, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { db } from '../firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface CalmModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string;
}

export function CalmProtocolModal({ isOpen, onClose, triggerReason }: CalmModalProps) {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'options' | 'breathing' | 'silence_confirmed'>('options');
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Retén' | 'Exhala'>('Inhala');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('options');
      setCycleCount(0);
    }
  }, [isOpen]);

  // 4-7-8 Breathing Cycle
  useEffect(() => {
    if (activeTab !== 'breathing') return;

    let timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (breathPhase === 'Inhala') {
          setBreathPhase('Retén');
          return 7;
        } else if (breathPhase === 'Retén') {
          setBreathPhase('Exhala');
          return 8;
        } else {
          setCycleCount((c) => c + 1);
          setBreathPhase('Inhala');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, breathPhase]);

  const handleStartBreathing = async () => {
    setActiveTab('breathing');
    setBreathPhase('Inhala');
    setSecondsLeft(4);
    await logAction('calm_activated', { type: 'breathing_exercise', reason: triggerReason || 'manual' });
    try {
      if (user && db) {
        await addDoc(collection(db, 'users', user.uid, 'calm_events'), {
          type: 'breathing_exercise',
          createdAt: serverTimestamp(),
          reason: triggerReason || 'manual'
        });
      }
    } catch (e) {
      // offline fallback
    }
  };

  const handleEmergencyCoach = async () => {
    await logAction('calm_activated', { type: 'emergency_coach_contact' });
    try {
      if (user && db) {
        await addDoc(collection(db, 'users', user.uid, 'calm_events'), {
          type: 'emergency_coach_contact',
          createdAt: serverTimestamp()
        });
      }
    } catch (e) {}
    onClose();
    navigate('/dashboard/messages');
  };

  const handleSilenceMetrics = async () => {
    const silenceUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    try {
      if (user && db) {
        await updateDoc(doc(db, 'users', user.uid), {
          calmSilencedUntil: silenceUntil
        });
        await addDoc(collection(db, 'users', user.uid, 'calm_events'), {
          type: 'silence_metrics_24h',
          createdAt: serverTimestamp()
        });
      }
      localStorage.setItem(`calm_silence_${user?.uid}`, silenceUntil);
    } catch (e) {}

    await logAction('calm_activated', { type: 'silence_metrics_24h' });
    setActiveTab('silence_confirmed');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0B0F17] border border-white/15 p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#7C5CFF]/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#22D3EE]/20 rounded-full blur-[80px] pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {activeTab === 'options' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/15 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
                <Wind size={26} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#22D3EE] uppercase">
                  Protocolo de Calma Proactiva
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Toma una pausa consciente
                </h3>
              </div>
            </div>

            {triggerReason && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
                <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold">Detección anticipatoria:</strong> {triggerReason}
                </p>
              </div>
            )}

            <p className="text-sm text-slate-300 leading-relaxed">
              El estrés y la fatiga cognitiva nublan tus decisiones. Selecciona una acción restauradora inmediata:
            </p>

            <div className="space-y-3">
              <button
                onClick={handleStartBreathing}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22D3EE]/40 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center text-[#22D3EE]">
                    <Wind size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                      Respira conmigo (4-7-8)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Ejercicio guiado de 2 minutos para reducir cortisol y pulso cardíaco.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#22D3EE] px-2.5 py-1 rounded-lg bg-[#22D3EE]/10">
                  Iniciar
                </span>
              </button>

              <button
                onClick={handleEmergencyCoach}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#7C5CFF]/40 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#7C5CFF]/10 flex items-center justify-center text-[#7C5CFF]">
                    <MessageCircleHeart size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#7C5CFF] transition-colors">
                      Hablar con coach de guardia
                    </h4>
                    <p className="text-xs text-slate-400">
                      Apertura inmediata de canal prioritario con mentores disponibles.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#7C5CFF] px-2.5 py-1 rounded-lg bg-[#7C5CFF]/10">
                  Conectar
                </span>
              </button>

              <button
                onClick={handleSilenceMetrics}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-500 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    <BellOff size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-slate-200 transition-colors">
                      Silenciar métricas por 24h
                    </h4>
                    <p className="text-xs text-slate-400">
                      Modo zen: oculta alertas de burnout y barras de exigencia hoy.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-lg bg-white/5">
                  Pausar
                </span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'breathing' && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#22D3EE]">
              Ciclo {cycleCount + 1} de 4
            </span>

            {/* Breathing Animated Circle */}
            <div className="relative flex items-center justify-center w-52 h-52">
              <div 
                className="absolute inset-0 rounded-full border-2 border-[#22D3EE]/30 transition-all duration-1000"
                style={{
                  transform: breathPhase === 'Inhala' ? 'scale(1.15)' : breathPhase === 'Retén' ? 'scale(1.15)' : 'scale(0.85)',
                  boxShadow: breathPhase === 'Inhala' || breathPhase === 'Retén' 
                    ? '0 0 50px rgba(34, 211, 238, 0.4)' 
                    : '0 0 15px rgba(34, 211, 238, 0.1)'
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tight text-white mb-1">
                  {breathPhase}
                </span>
                <span className="text-5xl font-mono font-black text-[#22D3EE]">
                  {secondsLeft}s
                </span>
                <span className="text-[11px] text-slate-400 mt-2">
                  {breathPhase === 'Inhala' ? 'Profundo por la nariz' : breathPhase === 'Retén' ? 'Mantén el aire con calma' : 'Suelta lento por la boca'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setBreathPhase('Inhala');
                  setSecondsLeft(4);
                  setCycleCount(0);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 flex items-center gap-2"
              >
                <RotateCcw size={14} /> Reiniciar
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className="px-5 py-2 rounded-xl bg-[#22D3EE] text-slate-950 text-xs font-bold hover:bg-[#22D3EE]/90 transition-all"
              >
                Terminar sesión
              </button>
            </div>
          </div>
        )}

        {activeTab === 'silence_confirmed' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">
              Modo Calma Activado (24h)
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Tus indicadores de estrés y requerimientos diarios han sido silenciados hasta mañana. Disfruta tu proceso a tu propio ritmo.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
            >
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
