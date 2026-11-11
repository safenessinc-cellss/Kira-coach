import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SEED_MANDALAS, SEED_MICROLEARNING_CHAPTERS } from '../lib/seedData';
import { EnergyTierBadge } from '../components/EnergyTierBadge';
import { 
  Sparkles, 
  BookOpen, 
  Palette, 
  Brain, 
  Video, 
  Lock, 
  Unlock, 
  Play, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw,
  Compass
} from 'lucide-react';

export function EliteLibrary() {
  const { user } = useAuth();
  const points = user?.points || 1250;

  const [activeTab, setActiveTab] = useState<'microlearning' | 'mandalas' | 'ontologico' | 'masterclasses'>('microlearning');

  // Mandala coloring state
  const [activeMandala, setActiveMandala] = useState<any | null>(null);
  const [selectedColor, setSelectedColor] = useState('#7C5CFF');
  const [mandalaPetals, setMandalaPetals] = useState<Record<number, string>>({});
  const [uploadedArtNotice, setUploadedArtNotice] = useState(false);

  const colors = ['#7C5CFF', '#22D3EE', '#F43F5E', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#3B82F6'];

  const handleColorPetal = (index: number) => {
    setMandalaPetals(prev => ({ ...prev, [index]: selectedColor }));
  };

  const handleResetMandala = () => {
    setMandalaPetals({});
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border-[#7C5CFF]/25">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C5CFF]/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#22D3EE] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} /> Fusión KIRA 2.1 + kira.coach
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bóveda Élite & Santuario Creativo
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Recursos avanzados clasificados por rango energético: microaprendizaje, arteterapia con mandalas fractales, distinciones ontológicas y masterclasses exclusivas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <EnergyTierBadge points={points} showProgress />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'microlearning', label: 'Microaprendizaje (Capítulos)', icon: BookOpen },
          { id: 'mandalas', label: 'Mandalas & Arteterapia', icon: Palette },
          { id: 'ontologico', label: 'Coaching Ontológico', icon: Compass },
          { id: 'masterclasses', label: 'Masterclasses VIP', icon: Video },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MICROAPRENDIZAJE */}
      {activeTab === 'microlearning' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Píldoras Diarias de Sabiduría (kira.coach)
              </h2>
              <p className="text-xs text-slate-400">
                Micro-lecciones de alto impacto somático y psicológico diseñadas para consumir en menos de 5 minutos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEED_MICROLEARNING_CHAPTERS.map(ch => (
              <div key={ch.id} className="glass-panel p-6 rounded-3xl border border-white/8 hover:border-[#22D3EE]/40 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#22D3EE] mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#22D3EE]/10 border border-[#22D3EE]/20">{ch.duration}</span>
                    <span className="text-slate-400">{ch.tags[0]}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#22D3EE] transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {ch.insight}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/8 space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                    Micro-Práctica del Día
                  </span>
                  <p className="text-xs text-slate-300 italic">
                    "{ch.exercise}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MANDALAS Y ARTETERAPIA */}
      {activeTab === 'mandalas' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Mandalas Fractales & Meditación con Color
            </h2>
            <p className="text-xs text-slate-400">
              Descompresión neuroafectiva mediante geometría sagrada. Selecciona un color y colorea los pétalos concéntricos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Gallery list */}
            <div className="space-y-4">
              {SEED_MANDALAS.map(m => (
                <div
                  key={m.id}
                  onClick={() => setActiveMandala(m)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    activeMandala?.id === m.id
                      ? 'bg-[#7C5CFF]/20 border-[#7C5CFF] shadow-[0_0_20px_rgba(124,92,255,0.2)]'
                      : 'glass-panel hover:bg-white/10 border-white/8'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-sm text-white">{m.title}</h3>
                    <span className="text-[10px] font-bold text-[#22D3EE] px-2 py-0.5 rounded-md bg-[#22D3EE]/10">
                      {m.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{m.description}</p>
                </div>
              ))}

              {/* Upload Art Card */}
              <div className="p-5 rounded-3xl border border-dashed border-white/20 bg-white/2 text-center space-y-3">
                <Upload size={20} className="mx-auto text-slate-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">¿Creaste un mandala en papel?</h4>
                <p className="text-[11px] text-slate-400">Sube una fotografía de tu creación para ganar +30 Energy Pts.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={() => {
                    setUploadedArtNotice(true);
                    setTimeout(() => setUploadedArtNotice(false), 4000);
                  }}
                  className="hidden"
                  id="artUploadInput"
                />
                <label
                  htmlFor="artUploadInput"
                  className="inline-block px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white cursor-pointer"
                >
                  Subir Fotografía
                </label>
                {uploadedArtNotice && (
                  <p className="text-xs font-bold text-emerald-400">¡Obra recibida! Registrada en tu racha creativa.</p>
                )}
              </div>
            </div>

            {/* Interactive Mandala Canvas */}
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center space-y-6">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Lienzo Activo: {activeMandala?.title || 'Mandala de la Calma Serena'}
                </span>
                <button
                  onClick={handleResetMandala}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={14} /> Limpiar
                </button>
              </div>

              {/* Color Palette Selector */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Paleta:</span>
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedColor === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Geometric SVG Mandala */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {/* Central Core */}
                  <circle
                    cx="100"
                    cy="100"
                    r="20"
                    fill={mandalaPetals[0] || 'rgba(255,255,255,0.1)'}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.5"
                    onClick={() => handleColorPetal(0)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />

                  {/* 8 Inner Petals */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 360) / 8;
                    const rad = (angle * Math.PI) / 180;
                    const x = 100 + 40 * Math.cos(rad);
                    const y = 100 + 40 * Math.sin(rad);
                    return (
                      <circle
                        key={i + 1}
                        cx={x}
                        cy={y}
                        r="18"
                        fill={mandalaPetals[i + 1] || 'rgba(255,255,255,0.06)'}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1.5"
                        onClick={() => handleColorPetal(i + 1)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    );
                  })}

                  {/* 8 Outer Petals */}
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 360) / 8 + 22.5;
                    const rad = (angle * Math.PI) / 180;
                    const x = 100 + 70 * Math.cos(rad);
                    const y = 100 + 70 * Math.sin(rad);
                    return (
                      <rect
                        key={i + 9}
                        x={x - 12}
                        y={y - 12}
                        width="24"
                        height="24"
                        rx="6"
                        transform={`rotate(${angle} ${x} ${y})`}
                        fill={mandalaPetals[i + 9] || 'rgba(255,255,255,0.04)'}
                        stroke="rgba(255,255,255,0.25)"
                        strokeWidth="1.5"
                        onClick={() => handleColorPetal(i + 9)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    );
                  })}
                </svg>
              </div>

              <p className="text-xs text-slate-400 text-center">
                Haz clic en cada sección geométrica para impregnarla con el color seleccionado y calmar tu mente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COACHING ONTOLÓGICO */}
      {activeTab === 'ontologico' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Matriz de Distinciones Ontológicas
            </h2>
            <p className="text-xs text-slate-400">
              Marcos teóricos para intervenir en tu manera de observar el mundo y disolver conversaciones tóxicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono font-bold text-[#7C5CFF] uppercase tracking-wider">
                Distinción Clave #1
              </span>
              <h3 className="text-lg font-bold text-white">Hechos vs. Juicios</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Un hecho no requiere defensa; es medible y observable. Un juicio vive en quien lo emite. Cuando confundes un juicio con un hecho, quedas atrapado en el sufrimiento o en la impotencia.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-3">
              <span className="text-[10px] font-mono font-bold text-[#22D3EE] uppercase tracking-wider">
                Distinción Clave #2
              </span>
              <h3 className="text-lg font-bold text-white">Peticiones vs. Quejas</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                La queja es pasiva e infantiliza al observador. La petición compromete a dos voluntades con condiciones de satisfacción y plazos temporales claros.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MASTERCLASSES */}
      {activeTab === 'masterclasses' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Masterclasses Exclusivas VIP
            </h2>
            <p className="text-xs text-slate-400">
              Grabaciones inmersivas de alta resolución con mentores internacionales de Safeness Inc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#7C5CFF]/80 backdrop-blur-md flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                    <Play size={24} className="ml-1" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Nivel Oro</span>
                <h3 className="text-base font-bold text-white mt-1">Hackeando la Respuesta Adrenal en 90 Segundos</h3>
                <p className="text-xs text-slate-400 mt-1">Por la Dra. Elena Rostova · 54 minutos</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#22D3EE]/80 backdrop-blur-md flex items-center justify-center text-slate-950 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                    <Play size={24} className="ml-1" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-widest">Nivel Plata</span>
                <h3 className="text-base font-bold text-white mt-1">Arte Fractal y Coherencia Cardíaca</h3>
                <p className="text-xs text-slate-400 mt-1">Por Valentina Rossi · 42 minutos</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
