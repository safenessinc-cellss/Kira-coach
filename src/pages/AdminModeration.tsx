import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { ShieldAlert, CheckCircle2, Trash2, AlertTriangle, MessageSquare, Ban } from 'lucide-react';

export function AdminModeration() {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();

  const [reports, setReports] = useState([
    {
      id: 'rep_1',
      reporterEmail: 'alumno.ejemplo@gmail.com',
      reportedEntity: 'Mensaje en Chat 1-a-1',
      reason: 'Uso de tono agresivo durante la sesión',
      date: '2026-11-09 14:20',
      status: 'pending',
      contentSnippet: '"Si no haces esto ahora estás perdiendo el tiempo completamente"'
    },
    {
      id: 'rep_2',
      reporterEmail: 'deuwyrobert@gmail.com',
      reportedEntity: 'Comentario en Foro de Curso',
      reason: 'Enlace promocional no autorizado',
      date: '2026-11-08 19:10',
      status: 'resolved',
      contentSnippet: '"Entren a este link externo para ganar dinero rápido"'
    }
  ]);

  const handleDismiss = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'dismissed' } : r));
    alert('Reporte desestimado.');
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm('¿Eliminar el contenido reportado y emitir advertencia al emisor?')) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
      await logAction('report_filed', { action: 'content_deleted', reportId: id });
      alert('Contenido eliminado del sistema.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Seguridad & Convivencia
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Centro de Moderación de Contenido
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Auditoría de quejas, mensajes reportados y cumplimiento de los estándares éticos de Safeness Inc.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400">{r.id}</span>
                <span className="text-sm font-bold text-white">{r.reportedEntity}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  r.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : r.status === 'dismissed' ? 'bg-slate-500/20 text-slate-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {r.status}
                </span>
              </div>

              <p className="text-xs text-rose-300 font-semibold">
                Motivo: {r.reason}
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 font-mono">
                {r.contentSnippet}
              </div>

              <p className="text-[11px] text-slate-400">
                Reportado por: <span className="text-white">{r.reporterEmail}</span> · Fecha: {r.date}
              </p>
            </div>

            {r.status === 'pending' && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleDismiss(r.id)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Desestimar
                </button>
                <button
                  onClick={() => handleDeleteContent(r.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 size={14} /> Borrar Contenido
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
