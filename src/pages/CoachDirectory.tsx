import React, { useState } from 'react';
import { SEED_COACHES } from '../lib/seedData';
import { UserProfile } from '../types';
import { Star, MessageSquare, ShieldCheck, Search, Filter, Globe, GraduationCap, X, Calendar, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CoachDirectory() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [selectedLanguage, setSelectedLanguage] = useState('Todos');
  const [selectedCoachModal, setSelectedCoachModal] = useState<Partial<UserProfile> | null>(null);

  const specialties = ['Todas', 'Neurocoaching & Regulación Nerviosa', 'Coaching Ontológico y Propósito', 'Arteterapia y Expresión Emocional'];
  const languages = ['Todos', 'Español', 'Inglés', 'Italiano'];

  const filteredCoaches = SEED_COACHES.filter((c) => {
    const matchesSearch = c.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || c.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpecialty === 'Todas' || c.specialty === selectedSpecialty;
    const matchesLang = selectedLanguage === 'Todos' || c.languages?.includes(selectedLanguage);
    return matchesSearch && matchesSpec && matchesLang;
  });

  const handleContact = (coach: Partial<UserProfile>) => {
    setSelectedCoachModal(null);
    navigate(`/dashboard/messages?coachId=${coach.uid}&coachName=${encodeURIComponent(coach.displayName || '')}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#22D3EE] uppercase">
          Comunidad de Mentores
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Directorio de Coaches & Terapeutas
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Profesionales certificados por Safeness Inc. especializados en neuroregulación, coaching ontológico y bienestar somático.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, técnica o palabra clave..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFF]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-56">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#7C5CFF]"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-36">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#7C5CFF]"
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Coaches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map((coach) => (
          <div 
            key={coach.uid}
            className="glass-panel p-6 rounded-3xl border border-white/8 hover:border-[#7C5CFF]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img 
                  src={coach.photoURL} 
                  alt={coach.displayName} 
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#7C5CFF]/30 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-base truncate">
                      {coach.displayName}
                    </h3>
                    <span title="Verificado por Safeness Inc.">
                      <ShieldCheck size={16} className="text-[#22D3EE] shrink-0" />
                    </span>
                  </div>
                  <p className="text-xs text-[#22D3EE] font-medium mt-0.5 line-clamp-1">
                    {coach.specialty}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                    <span className="flex items-center text-amber-300 font-bold gap-1">
                      <Star size={13} className="fill-amber-300" /> {coach.rating}
                    </span>
                    <span>•</span>
                    <span>{coach.reviewsCount} reseñas</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {coach.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-[10px] text-slate-300 font-mono">
                  {coach.level}
                </span>
                {coach.languages?.map((lang) => (
                  <span key={lang} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-[10px] text-slate-300">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/8">
              <button
                onClick={() => setSelectedCoachModal(coach)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 transition-colors"
              >
                Ver Perfil
              </button>
              <button
                onClick={() => handleContact(coach)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] hover:opacity-90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <MessageSquare size={14} /> Contactar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Perfil Completo */}
      {selectedCoachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0B0F17] border border-white/15 p-6 sm:p-8 text-white space-y-6">
            <button 
              onClick={() => setSelectedCoachModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4">
              <img 
                src={selectedCoachModal.photoURL} 
                alt="" 
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#22D3EE]/40"
              />
              <div>
                <h3 className="text-xl font-bold">{selectedCoachModal.displayName}</h3>
                <p className="text-xs text-[#22D3EE]">{selectedCoachModal.specialty}</p>
                <p className="text-xs text-slate-400 mt-1">Tarifa estimada: ${selectedCoachModal.hourlyRate}/sesión</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trayectoria</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedCoachModal.bio}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between text-xs">
              <span className="text-slate-400">Verificación Oficial:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Avalado por Safeness Inc.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCoachModal(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold"
              >
                Cerrar
              </button>
              <button
                onClick={() => handleContact(selectedCoachModal)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Iniciar Conversación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
