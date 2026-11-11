import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function GlobalFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0B0F17]/90 backdrop-blur-md py-4 px-6 mt-auto text-center shrink-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck size={14} className="text-[#22D3EE]" />
          <span>
            © 2026 Safeness Inc. — KIRA 2.1 · Plataforma de bienestar, coaching e inteligencia artificial.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="hover:text-slate-300 transition-colors">Privacidad Zero-Leak</span>
          <span>•</span>
          <span className="hover:text-slate-300 transition-colors">Términos de Servicio</span>
          <span>•</span>
          <span className="text-slate-400">v2.1.0-fusion</span>
        </div>
      </div>
    </footer>
  );
}
