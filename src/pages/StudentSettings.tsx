import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, User, Palette, Info, ExternalLink, Save, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Brand';

export function StudentSettings() {
  const { user, switchRole } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [activeTab, setActiveTab] = useState<'perfil' | 'acerca_de' | 'privacidad'>('perfil');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Preferencias del Sistema
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Configuración & Acerca de KIRA 2.1
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Administra los datos de tu cuenta, políticas de privacidad Zero-Leak y créditos de autoría.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-4">
        {[
          { id: 'perfil', label: 'Mi Perfil' },
          { id: 'acerca_de', label: 'Acerca de KIRA 2.1 & Safeness Inc.' },
          { id: 'privacidad', label: 'Privacidad Zero-Leak' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === t.id
                ? 'border-[#7C5CFF] text-[#22D3EE]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'perfil' && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-white">Datos del Usuario</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Nombre Completo
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Correo Electrónico (Registrado)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3 rounded-2xl bg-white/2 border border-white/5 text-sm text-slate-500 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Cambio Rápido de Rol (Entorno de Verificación)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['alumno', 'coach', 'admin', 'hr_admin'] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase border transition-all ${
                      user?.role === r
                        ? 'bg-[#7C5CFF] text-white border-[#7C5CFF]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/8 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90"
            >
              <Save size={16} /> Guardar Cambios
            </button>

            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={16} /> Datos actualizados exitosamente
              </span>
            )}
          </div>
        </form>
      )}

      {activeTab === 'acerca_de' && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/8">
            <Logo size={56} withText />
          </div>

          <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
            <h3 className="text-xl font-black text-white tracking-tight">
              KIRA 2.1 Unificada — Ecosistema Integral de Bienestar, Coaching e Inteligencia Artificial
            </h3>
            <p>
              KIRA 2.1 fusiona la plataforma académica y ontológica de KIRA con las metodologías adaptativas de bienestar somático y microaprendizaje de kira.coach en un solo ecosistema unificado.
            </p>
            <p>
              Diseñado con arquitectura de alto rendimiento, análisis prosódico de sesiones, journaling emocional contextual y protocolos de calma anticipatoria.
            </p>
          </div>

          {/* Mandatory Ownership & Credits Box */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#22D3EE]">
              <ShieldCheck size={16} /> Créditos de Propiedad Intelectual
            </div>
            <p className="text-sm font-bold text-white">
              © 2026 Safeness Inc. Todos los derechos reservados.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Desarrollado y operado globalmente por Safeness Inc. Las marcas, metodologías pedagógicas, sistemas de biofeedback y algoritmos de inferencia son propiedad exclusiva de Safeness Inc.
            </p>
            <div className="pt-2">
              <a
                href="https://safeness.inc"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C5CFF] hover:text-[#22D3EE] transition-colors"
              >
                Visitar Safeness Inc. <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'privacidad' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-400" />
            Compromiso Zero-Leak & Privacidad Blindada
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tus reflexiones en el Journaling IA y tus estados biométricos son estrictamente privados. Ni los empleadores corporativos (Portal HR) ni los administradores tienen acceso a tus textos confidenciales.
          </p>
          <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
            <li>Cifrado en tránsito y en reposo.</li>
            <li>Agregación estadística anonimizada para analítica empresarial.</li>
            <li>No venta ni transferencia de datos a terceros anunciantes.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
