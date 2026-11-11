import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { SEED_CERTIFICATES } from '../lib/seedData';
import { Certificate } from '../types';
import { Award, CheckCircle2, XCircle, ExternalLink, PlusCircle, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminCertificateApprovals() {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();
  const [certs, setCerts] = useState<Certificate[]>(SEED_CERTIFICATES);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual emission form
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courseTitle, setCourseTitle] = useState('Biología del Éxito & Calma Interior');

  const filtered = certs.filter(c => filterStatus === 'all' || c.status === filterStatus);

  const handleApprove = async (certId: string) => {
    setCerts(prev => prev.map(c => c.id === certId ? { ...c, status: 'active' } : c));
    await logAction('certificate_issued', { certId, manualApprovedBy: user?.email });
    alert('Certificado aprobado y activado en el registro público de Safeness Inc.');
  };

  const handleRevoke = async (certId: string) => {
    if (confirm('¿Estás seguro de revocar este certificado? Dejará de ser válido en la URL pública.')) {
      setCerts(prev => prev.map(c => c.id === certId ? { ...c, status: 'revoked' } : c));
      await logAction('certificate_issued', { certId, revoked: true, revokedBy: user?.email });
    }
  };

  const handleManualIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const newCert: Certificate = {
      id: `cert_manual_${Date.now()}`,
      certificateNumber: `KIRA-2026-M${Math.floor(1000 + Math.random() * 9000)}`,
      userId: `user_manual_${Date.now()}`,
      userName: studentName.trim(),
      userEmail: studentEmail.trim() || 'student@safeness.inc',
      courseId: 'course_manual',
      courseTitle,
      coachId: 'admin',
      coachName: 'Safeness Certified Board',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'active',
      verificationHash: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      score: 100,
      organization: 'Safeness Inc.'
    };

    setCerts([newCert, ...certs]);
    setShowManualModal(false);
    setStudentName('');
    setStudentEmail('');
    await logAction('certificate_issued', { manualEmit: true, certId: newCert.id });
    alert('Certificado manual emitido exitosamente con verificación pública.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
            Gobernanza de Títulos
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Aprobación y Emisión de Certificados
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-1">
            Audita las solicitudes de certificación y administra el registro criptográfico de graduados.
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-all self-start"
        >
          <PlusCircle size={16} /> Emitir Manualmente
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {['all', 'pending_admin', 'active', 'revoked'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === status
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {status === 'all' ? 'Todos' : status === 'pending_admin' ? 'Pendientes de Aprobación' : status === 'active' ? 'Activos' : 'Revocados'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="p-4 pl-6">Código</th>
              <th className="p-4">Estudiante</th>
              <th className="p-4">Curso Acreditado</th>
              <th className="p-4">Puntaje</th>
              <th className="p-4">Estado</th>
              <th className="p-4 pr-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4 pl-6 font-mono font-bold text-slate-300">{c.certificateNumber}</td>
                <td className="p-4 font-bold text-white">{c.userName}</td>
                <td className="p-4 text-slate-300">{c.courseTitle}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">{c.score}%</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : c.status === 'revoked' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right space-x-2">
                  <Link
                    to={`/verify/${c.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
                  >
                    <ExternalLink size={12} /> Ver
                  </Link>

                  {c.status === 'pending_admin' && (
                    <button
                      onClick={() => handleApprove(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors"
                    >
                      Aprobar
                    </button>
                  )}

                  {c.status === 'active' && (
                    <button
                      onClick={() => handleRevoke(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-colors"
                    >
                      Revocar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Issue Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleManualIssue} className="w-full max-w-md rounded-3xl bg-[#0B0F17] border border-white/15 p-6 sm:p-8 text-white space-y-4">
            <h3 className="text-lg font-bold">Emitir Certificado Manual</h3>
            <p className="text-xs text-slate-400">Genera una acreditación con hash criptográfico y registro oficial de Safeness Inc.</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Completo del Alumno</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej: Lic. Mariana Ramos"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Programa</label>
                <select
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                >
                  <option value="Biología del Éxito & Calma Interior">Biología del Éxito & Calma Interior</option>
                  <option value="Maestría en Coaching Ontológico & Liderazgo">Maestría en Coaching Ontológico & Liderazgo</option>
                  <option value="Mandalas Fractales & Arteterapia Consciente">Mandalas Fractales & Arteterapia Consciente</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase"
              >
                Emitir Acreditación
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
