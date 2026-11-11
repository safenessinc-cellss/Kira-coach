import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Palette, Sparkles, CheckCircle2, RotateCcw, Eye } from 'lucide-react';
import { Logo } from '../components/Brand';

export function AdminBranding() {
  const { user } = useAuth();
  const [appName, setAppName] = useState('KIRA 2.1');
  const [primaryColor, setPrimaryColor] = useState('#7C5CFF');
  const [secondaryColor, setSecondaryColor] = useState('#22D3EE');
  const [logoImage, setLogoImage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      if (db) {
        getDoc(doc(db, 'settings', 'website')).then((snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.appName) setAppName(data.appName);
            if (data.primaryColor) setPrimaryColor(data.primaryColor);
            if (data.secondaryColor) setSecondaryColor(data.secondaryColor);
            if (data.logoImage) setLogoImage(data.logoImage);
          }
        });
      }
    } catch {}
  }, []);

  const handleApplyLive = (e: React.FormEvent) => {
    e.preventDefault();
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--accent', secondaryColor);

    try {
      if (db) {
        setDoc(doc(db, 'settings', 'website'), {
          appName,
          primaryColor,
          secondaryColor,
          logoImage,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch {}

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setAppName('KIRA 2.1');
    setPrimaryColor('#7C5CFF');
    setSecondaryColor('#22D3EE');
    setLogoImage('');
    document.documentElement.style.setProperty('--primary', '#7C5CFF');
    document.documentElement.style.setProperty('--accent', '#22D3EE');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Personalización White-Label
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Identidad de Marca & Paleta Visual
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Configura los colores primarios y de acento, logotipo y nombre de la aplicación con reflejo en vivo e instantáneo en todos los portales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <form onSubmit={handleApplyLive} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Palette size={18} className="text-[#22D3EE]" /> Configuración de Estilo
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Nombre de la Aplicación
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Color Primario
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      document.documentElement.style.setProperty('--primary', e.target.value);
                    }}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Color de Acento
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => {
                      setSecondaryColor(e.target.value);
                      document.documentElement.style.setProperty('--accent', e.target.value);
                    }}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                URL del Logotipo Personalizado (Opcional)
              </label>
              <input
                type="url"
                value={logoImage}
                onChange={(e) => setLogoImage(e.target.value)}
                placeholder="https://miservidor.com/logo.png"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
            >
              <RotateCcw size={14} /> Restaurar Por Defecto
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Sparkles size={16} /> Guardar & Aplicar en Vivo
            </button>
          </div>

          {savedSuccess && (
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-2">
              <CheckCircle2 size={16} /> Estilos sincronizados en tiempo real en toda la plataforma.
            </p>
          )}
        </form>

        {/* Live Preview Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/8">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Eye size={14} /> Previsualización en Tiempo Real
              </span>
              <span className="text-[10px] font-mono text-[#22D3EE] font-bold">Safeness Preview</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B0F17] border border-white/10 space-y-4">
              <Logo size={48} withText />

              <div className="space-y-2 pt-2">
                <h3 className="text-base font-bold text-white">Botones y Acentos con Paleta Viva</h3>
                <div className="flex gap-2">
                  <button 
                    style={{ backgroundColor: primaryColor }}
                    className="px-4 py-2 rounded-xl text-slate-950 font-black text-xs uppercase"
                  >
                    Botón Primario
                  </button>
                  <button 
                    style={{ borderColor: secondaryColor, color: secondaryColor }}
                    className="px-4 py-2 rounded-xl border font-bold text-xs"
                  >
                    Contorno Acento
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Los cambios se propagan a través de variables CSS nativas sin recargar la página.
          </div>
        </div>
      </div>
    </div>
  );
}
