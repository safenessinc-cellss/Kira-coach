import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { SEED_COACH_APPLICATIONS } from '../lib/seedData';
import { CoachApplication } from '../types';
import { CheckCircle2, XCircle, Clock, MessageSquare, ShieldCheck, Mail, Globe, Award } from 'lucide-react';

export function AdminCoachApprovals() {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();
  const [applications, setApplications] = useState<CoachApplication[]>(SEED_COACH_APPLICATIONS);

  const handleApprove = async (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    setApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'approved' } : a))
    );

    await logAction('coach_approved', {
      applicantId: app.userId,
      applicantEmail: app.email,
      trialDays: 30
    });

    alert(`¡Coach ${app.name} aprobado exitosamente! Se le ha asignado el rol 'coach', visibilidad en directorio público y periodo de prueba de 30 días.`);
  };

  const handleReject = async (appId: string) => {
    const reason = prompt('Indica el motivo del rechazo:') || 'No cumple con los requisitos mínimos';
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    setApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'rejected' } : a))
    );

    await logAction('coach_rejected', {
      applicantId: app.userId,
      reason
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Gobernanza & Auditoría
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Cola de Aprobación de Coaches
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Verifica las credenciales, especialidad e idoneidad de los profesionales que postulan para mentoría en la red Safeness.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">{app.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  app.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : app.status === 'rejected'
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {app.status === 'approved' ? 'Aprobado' : app.status === 'rejected' ? 'Rechazado' : 'Pendiente Revisión'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {app.email}</span>
                <span>•</span>
                <span className="text-[#22D3EE] font-semibold">{app.specialty}</span>
                <span>•</span>
                <span>{app.experienceYears} años de experiencia</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {app.bio}
              </p>

              <div className="flex gap-2">
                {app.languages.map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-[10px] text-slate-400">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {app.status === 'pending' && (
              <div className="flex md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(app.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-400 transition-all"
                >
                  <CheckCircle2 size={16} /> Aprobar Coach
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase transition-all"
                >
                  <XCircle size={16} /> Rechazar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
