import React from 'react';
import { Zap, ShieldCheck, Star, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { EnergyTier } from '../types';

interface EnergyTierBadgeProps {
  points?: number;
  className?: string;
  showProgress?: boolean;
}

export function getTierInfo(points: number = 0): {
  tier: EnergyTier;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: any;
  nextTierPoints: number;
  progressPercent: number;
} {
  if (points <= 500) {
    return {
      tier: 'Bronce',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/25',
      icon: Zap,
      nextTierPoints: 501,
      progressPercent: Math.min(100, Math.round((points / 500) * 100))
    };
  }
  if (points <= 1500) {
    return {
      tier: 'Plata',
      color: 'text-slate-300',
      bgColor: 'bg-slate-400/10',
      borderColor: 'border-slate-400/25',
      icon: ShieldCheck,
      nextTierPoints: 1501,
      progressPercent: Math.min(100, Math.round(((points - 500) / 1000) * 100))
    };
  }
  if (points <= 5000) {
    return {
      tier: 'Oro',
      color: 'text-amber-300',
      bgColor: 'bg-amber-300/10',
      borderColor: 'border-amber-300/25',
      icon: Star,
      nextTierPoints: 5001,
      progressPercent: Math.min(100, Math.round(((points - 1500) / 3500) * 100))
    };
  }
  return {
    tier: 'Platino',
    color: 'text-[#22D3EE]',
    bgColor: 'bg-[#22D3EE]/10',
    borderColor: 'border-[#22D3EE]/30',
    icon: Award,
    nextTierPoints: Infinity,
    progressPercent: 100
  };
}

export function EnergyTierBadge({ points = 0, className, showProgress = false }: EnergyTierBadgeProps) {
  const { tier, color, bgColor, borderColor, icon: Icon, nextTierPoints, progressPercent } = getTierInfo(points);

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <div 
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide backdrop-blur-md transition-all shadow-sm",
          bgColor, borderColor, color
        )}
        title={`${points} Energy Points acumulados`}
      >
        <Icon size={14} className="shrink-0" />
        <span className="font-mono text-white text-[11px]">{points} Pts</span>
        <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-white/10">
          {tier}
        </span>
      </div>

      {showProgress && nextTierPoints !== Infinity && (
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
