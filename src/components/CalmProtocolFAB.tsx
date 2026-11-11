import React, { useState } from 'react';
import { Wind } from 'lucide-react';
import { CalmProtocolModal } from './CalmProtocolModal';

export function CalmProtocolFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Activar Protocolo de Calma"
        className="fixed bottom-24 right-8 sm:bottom-8 sm:right-28 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0B0F17]/90 hover:bg-[#111827] border border-[#22D3EE]/40 text-slate-100 shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] transition-all duration-300 backdrop-blur-xl"
      >
        <div className="w-6 h-6 rounded-full bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] group-hover:scale-110 transition-transform">
          <Wind size={15} className="animate-pulse" />
        </div>
        <span className="text-xs font-bold tracking-wider text-slate-100 group-hover:text-[#22D3EE] transition-colors">
          Calma
        </span>
      </button>

      <CalmProtocolModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
