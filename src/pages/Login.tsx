import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Brand';
import { LogIn, ArrowRight, ShieldCheck, Heart, Sparkles, Building2, User } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

export function Login() {
  const { user, role, login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('alumno');

  // If already authenticated, redirect to appropriate role portal
  if (user) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'coach') return <Navigate to="/coach" replace />;
    if (role === 'hr_admin') return <Navigate to="/hr" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginSubmit = async (targetRole: UserRole) => {
    await login(targetRole);
    if (targetRole === 'admin') navigate('/admin');
    else if (targetRole === 'coach') navigate('/coach');
    else if (targetRole === 'hr_admin') navigate('/hr');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#7C5CFF]/15 blur-[140px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#22D3EE]/15 blur-[140px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full flex justify-between items-center max-w-5xl pt-4 z-10">
        <Logo size={42} withText />
        <span className="text-xs font-mono text-slate-400">
          Versión Unificada v2.1
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel rounded-[32px] border border-white/10 p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-white/10 flex items-center justify-center p-3 shadow-lg mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="loginLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <path d="M28 22v56h14V55l20 23h18L58 50l20-28H60L42 46V22z" fill="url(#loginLogoGrad)" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight uppercase">
          Acceso al Ecosistema
        </h1>
        <p className="mt-2 text-slate-400 text-xs leading-relaxed max-w-[300px]">
          Ingresa a tu espacio de alto rendimiento, bienestar adaptativo y mentoría ontológica.
        </p>

        {/* Role Selector Pills */}
        <div className="w-full mt-6 p-1 rounded-2xl bg-white/5 border border-white/8 grid grid-cols-4 gap-1">
          {[
            { id: 'alumno', label: 'Alumno' },
            { id: 'coach', label: 'Coach' },
            { id: 'admin', label: 'Admin' },
            { id: 'hr_admin', label: 'HR' }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRole(r.id as UserRole)}
              className={`py-2 rounded-xl text-[11px] font-bold uppercase transition-all ${
                selectedRole === r.id
                  ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="w-full mt-6 space-y-3">
          <button
            onClick={() => handleLoginSubmit(selectedRole)}
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black tracking-wider uppercase text-xs shadow-lg shadow-[#7C5CFF]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={16} /> Entrar como {selectedRole.toUpperCase()}
          </button>

          <p className="text-[11px] text-slate-400 mt-4">
            Autenticación segura con Google o credenciales institucionales de Safeness Inc.
          </p>
        </div>

        {/* Mandatory authorship credit in login */}
        <div className="mt-8 pt-4 border-t border-white/8 w-full text-center">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Desarrollado por Safeness Inc.
          </span>
        </div>
      </div>

      {/* Bottom Global Footer */}
      <div className="w-full text-center text-xs text-slate-400 py-4 z-10">
        © 2026 Safeness Inc. — KIRA 2.1 · Plataforma de bienestar, coaching e inteligencia artificial.
      </div>
    </div>
  );
}
