import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  variant?: 'color' | 'gold' | 'white' | 'luxury' | 'minimalist';
}

export function Logo({ className, size = 40, withText = false, variant = 'color' }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'website'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().logoImage) {
          setLogoUrl(docSnap.data().logoImage);
        }
      });
      return () => unsub();
    } catch {
      // Offline fallback
    }
  }, []);

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-white/10"
        style={{ width: size, height: size }}
      >
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt="KIRA 2.1 Logo" 
            className="w-full h-full object-cover" 
          />
        ) : (
          /* Default SVG Brand Symbol: Futuristic Geometric 'K' with purple/cyan gradient */
          <div className="w-full h-full bg-[#0B0F17] flex items-center justify-center p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="kiraBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="24" fill="#111827" />
              <path 
                d="M28 22v56h14V55l20 23h18L58 50l20-28H60L42 46V22z" 
                fill="url(#kiraBrandGrad)" 
              />
            </svg>
          </div>
        )}
      </div>

      {withText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black tracking-wider text-white">
              KIRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE]">2.1</span>
            </span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase mt-0.5">
            BY SAFENESS INC.
          </span>
        </div>
      )}
    </div>
  );
}

export function Seal({ className, size = 100 }: { className?: string; size?: number }) {
  return (
    <div 
      className={cn("relative flex items-center justify-center rounded-full drop-shadow-2xl border border-white/15 bg-gradient-to-br from-slate-900 to-[#0B0F17]", className)} 
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-1 rounded-full border border-[#7C5CFF]/30 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-12 h-12">
          <defs>
            <linearGradient id="sealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C5CFF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <path d="M30 25v50h12V53l18 22h16L56 49l18-24H58L42 45V25z" fill="url(#sealGrad)" />
        </svg>
      </div>
      <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-[#7C5CFF] text-[8px] font-black uppercase tracking-widest text-white shadow-md">
        Safeness Verified
      </div>
    </div>
  );
}
