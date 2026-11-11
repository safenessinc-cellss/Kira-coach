import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Brand';
import { LogIn, ShieldCheck, User, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

export function Login() {
  const { user, role, login, logout, loading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('alumno');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (authLoading) return <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-300">Verificando sesión segura…</div>;

  if (user && user.requestedRole === 'coach' && user.approvalStatus !== 'approved' && role !== 'coach' && role !== 'admin') {
    return (
      <main className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 text-white">
        <section className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <ShieldCheck className="mx-auto mb-4 text-cyan-300" size={42} />
          <h1 className="text-2xl font-black">Solicitud de Coach recibida</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">Tu cuenta todavía no tiene permisos de Coach. Un administrador de KIRA debe revisar y aprobar tu solicitud.</p>
          <button onClick={() => logout()} className="mt-6 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold hover:bg-white/15">Cerrar sesión</button>
        </section>
      </main>
    );
  }

  if (user) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'coach') return <Navigate to="/coach" replace />;
    if (role === 'hr_admin') return <Navigate to="/hr" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSubmit = async () => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      await login(selectedRole);
    } catch (error: any) {
      console.error('[Login] Google authentication failed:', error);
      setErrorMessage(error?.code === 'auth/unauthorized-domain'
        ? 'El dominio kira.coach todavía debe autorizarse en Firebase Authentication.'
        : 'No se pudo iniciar sesión con Google. Comprueba la conexión e inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#7C5CFF]/15 blur-[140px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#22D3EE]/15 blur-[140px] rounded-full mix-blend-screen" />
      </div>
      <div className="w-full flex justify-between items-center max-w-5xl pt-4 z-10">
        <Logo size={42} withText />
        <span className="text-xs font-mono text-slate-400">KIRA 2.1 · Acceso seguro</span>
      </div>
      <div className="w-full max-w-md glass-panel rounded-[32px] border border-white/10 p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-white/10 flex items-center justify-center p-3 shadow-lg mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
            <defs><linearGradient id="loginLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C5CFF" /><stop offset="100%" stopColor="#22D3EE" /></linearGradient></defs>
            <path d="M28 22v56h14V55l20 23h18L58 50l20-28H60L42 46V22z" fill="url(#loginLogoGrad)" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">Acceso al Ecosistema</h1>
        <p className="mt-2 text-slate-400 text-xs leading-relaxed max-w-[300px]">Inicia sesión con tu cuenta Google. El rol se obtiene de Firebase y nunca se concede desde este selector.</p>
        <div className="w-full mt-6 p-1 rounded-2xl bg-white/5 border border-white/8 grid grid-cols-2 gap-1">
          <button type="button" onClick={() => setSelectedRole('alumno')} aria-pressed={selectedRole === 'alumno'} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all ${selectedRole === 'alumno' ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950' : 'text-slate-400 hover:text-white'}`}>
            <User size={15} className="inline mr-2" />Alumno
          </button>
          <button type="button" onClick={() => setSelectedRole('coach')} aria-pressed={selectedRole === 'coach'} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all ${selectedRole === 'coach' ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950' : 'text-slate-400 hover:text-white'}`}>
            <GraduationCap size={15} className="inline mr-2" />Solicitar Coach
          </button>
        </div>
        <button onClick={handleLoginSubmit} disabled={submitting} className="w-full mt-6 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black tracking-wider uppercase text-xs shadow-lg shadow-[#7C5CFF]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {submitting ? 'Conectando…' : 'Continuar con Google'}
        </button>
        {errorMessage && <p role="alert" className="mt-4 text-xs text-rose-300 flex items-center gap-2"><AlertCircle size={15} />{errorMessage}</p>}
        <div className="mt-8 pt-4 border-t border-white/8 w-full text-center">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Desarrollado por Safeness Inc.</span>
        </div>
      </div>
      <div className="w-full text-center text-xs text-slate-400 py-4 z-10">© 2026 Safeness Inc. — KIRA 2.1 · Plataforma de bienestar, coaching e inteligencia artificial.</div>
    </div>
  );
}
