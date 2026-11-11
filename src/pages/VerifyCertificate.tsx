import React, { useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SEED_CERTIFICATES } from '../lib/seedData';
import { ShieldCheck, CheckCircle2, AlertTriangle, Printer, ArrowLeft, QrCode } from 'lucide-react';
import { Logo, Seal } from '../components/Brand';

export function VerifyCertificate() {
  const { certId } = useParams();
  const [searchParams] = useSearchParams();
  const shouldPrint = searchParams.get('print') === 'true';

  const cert = SEED_CERTIFICATES.find((c) => c.id === certId) || {
    id: certId || 'cert_default',
    certificateNumber: `KIRA-2026-${certId?.slice(-4) || '9920'}`,
    userId: 'user_public',
    userName: 'Roberto De Uwy',
    courseId: 'course_neuro_01',
    courseTitle: 'Biología del Éxito & Calma Interior',
    coachId: 'coach_elena_01',
    coachName: 'Dra. Elena Rostova',
    issueDate: '2026-11-02',
    status: 'active' as const,
    verificationHash: '7f9a2b1c4e8d3a6f9c2e1b4a8d3e5f7a',
    score: 98,
    organization: 'Safeness Inc.'
  };

  useEffect(() => {
    if (shouldPrint) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [shouldPrint]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans print:bg-white print:text-black">
      {/* Top Bar (Hidden on print) */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 print:hidden">
        <Link 
          to="/dashboard/certificates"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Volver a mis certificados
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
          >
            <Printer size={15} /> Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Physical Diploma Layout */}
      <div className="max-w-4xl w-full mx-auto my-auto relative rounded-[32px] p-8 sm:p-14 bg-gradient-to-b from-[#131B2A] to-[#0B0F17] border-2 border-white/15 shadow-[0_0_80px_rgba(124,92,255,0.15)] overflow-hidden print:border print:border-black print:bg-white print:shadow-none">
        {/* Subtle decorative corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#7C5CFF]/60 print:border-black" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#7C5CFF]/60 print:border-black" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#7C5CFF]/60 print:border-black" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#7C5CFF]/60 print:border-black" />

        {/* Certificate Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <Logo size={56} withText />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-[11px] font-mono font-bold tracking-widest uppercase print:border print:border-black print:text-black">
            <ShieldCheck size={14} /> Certificado Oficial Auténtico
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-wider uppercase text-white print:text-black mt-2">
            Certificado de Logro
          </h1>
          <p className="text-xs tracking-[0.3em] font-sans font-bold text-slate-400 uppercase print:text-slate-700">
            Otorgado en reconocimiento a la excelencia académica y práctica a:
          </p>
        </div>

        {/* Student Name */}
        <div className="my-8 sm:my-12 text-center">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#22D3EE] tracking-tight border-b border-white/15 pb-4 max-w-lg mx-auto print:text-black">
            {cert.userName}
          </h2>
          <p className="text-sm text-slate-300 mt-4 max-w-md mx-auto print:text-black">
            Por haber completado satisfactoriamente los requisitos teórico-prácticos, evaluaciones formativas y estándares ontológicos del programa:
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#7C5CFF] tracking-tight mt-2 print:text-black">
            {cert.courseTitle}
          </h3>
        </div>

        {/* Verification & Signatures Footer */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center sm:text-left print:border-black">
          {/* Coach Signature */}
          <div className="space-y-1">
            <div className="h-10 flex items-center justify-center sm:justify-start">
              <span className="font-serif italic text-lg text-slate-300 print:text-black">
                {cert.coachName}
              </span>
            </div>
            <div className="border-t border-white/20 pt-1">
              <p className="text-xs font-bold text-white print:text-black">{cert.coachName}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Mentor Certificador</p>
            </div>
          </div>

          {/* Central Verification Seal */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <Seal size={72} />
            <span className="text-[9px] font-mono text-slate-400">Score: {cert.score}%</span>
          </div>

          {/* Issue Details & Hash */}
          <div className="space-y-1 text-center sm:text-right text-xs">
            <p className="text-slate-400">
              Emitido por: <strong className="text-white print:text-black">KIRA · Safeness Inc.</strong>
            </p>
            <p className="text-slate-400">
              Fecha: <span className="font-mono text-white print:text-black">{cert.issueDate}</span>
            </p>
            <p className="text-[10px] font-mono text-slate-400 truncate" title={cert.verificationHash}>
              Hash: {cert.verificationHash}
            </p>
          </div>
        </div>
      </div>

      {/* Public Footer */}
      <div className="max-w-4xl w-full mx-auto pt-6 text-center text-xs text-slate-400 print:hidden">
        © 2026 Safeness Inc. — KIRA 2.1 · Registro Criptográfico Público de Verificación
      </div>
    </div>
  );
}
