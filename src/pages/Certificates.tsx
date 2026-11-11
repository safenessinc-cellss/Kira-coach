import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SEED_CERTIFICATES } from '../lib/seedData';
import { Certificate } from '../types';
import { Award, Download, Share2, CheckCircle2, Clock, ShieldAlert, ExternalLink, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Certificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>(SEED_CERTIFICATES);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (cert: Certificate) => {
    setDownloadingId(cert.id);
    setTimeout(() => {
      // Simulate generated print/PDF view
      window.open(`/verify/${cert.id}?print=true`, '_blank');
      setDownloadingId(null);
    }, 600);
  };

  const handleShare = (cert: Certificate) => {
    const url = `${window.location.origin}/verify/${cert.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('¡Enlace de verificación pública copiado al portapapeles!');
    } else {
      prompt('Copia el enlace de verificación pública:', url);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Acreditaciones Oficiales
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Mis Certificados de Competencia
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Certificaciones criptográficamente verificables emitidas por Safeness Inc. con validez pública e inmutable.
        </p>
      </div>

      {certs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto">
            <Award size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">Aún no tienes certificados</h3>
          <p className="text-xs text-slate-400">
            Completa el 100% de las lecciones de tus cursos y aprueba las evaluaciones prácticas para desbloquear tu titulación.
          </p>
          <Link
            to="/dashboard/courses"
            className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-bold text-xs uppercase"
          >
            Ir a mis cursos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((c) => {
            const isActive = c.status === 'active';
            const isPending = c.status === 'pending_admin';

            return (
              <div
                key={c.id}
                className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#7C5CFF]/40 transition-all"
              >
                {/* Decorative border bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isActive ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE]' : 'bg-amber-400'}`} />

                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 block uppercase">
                        {c.certificateNumber}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1 group-hover:text-[#22D3EE] transition-colors">
                        {c.courseTitle}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Mentor evaluador: <strong className="text-white">{c.coachName}</strong>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                          <CheckCircle2 size={12} /> Activo
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase">
                          <Clock size={12} /> Pendiente Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-2 mb-6">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Puntaje de Aprobación:</span>
                      <span className="font-bold text-emerald-400 font-mono">{c.score}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Fecha de Emisión:</span>
                      <span className="text-white font-mono">{c.issueDate}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Hash de Verificación:</span>
                      <span className="text-slate-300 font-mono text-[11px] truncate max-w-[140px]" title={c.verificationHash}>
                        {c.verificationHash.slice(0, 12)}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <Link
                    to={`/verify/${c.id}`}
                    target="_blank"
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink size={14} /> Verificar
                  </Link>

                  <button
                    onClick={() => handleDownload(c)}
                    disabled={!isActive}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] disabled:opacity-50 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Download size={14} /> {downloadingId === c.id ? 'Generando...' : 'Descargar PDF'}
                  </button>

                  <button
                    onClick={() => handleShare(c)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors"
                    title="Compartir enlace de verificación"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
