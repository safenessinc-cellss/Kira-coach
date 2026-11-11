import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SEED_YOUTUBE_VIDEOS } from '../lib/seedData';
import { YouTubeChannelVideo } from '../types';
import { 
  Play, 
  Video, 
  Radio, 
  PlusCircle, 
  ShieldCheck, 
  Users, 
  ExternalLink, 
  Eye, 
  Clock, 
  Sparkles,
  Lock,
  X
} from 'lucide-react';

export function CoachYouTubeChannel() {
  const { user, role } = useAuth();
  const [videos, setVideos] = useState<YouTubeChannelVideo[]>(SEED_YOUTUBE_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeChannelVideo>(SEED_YOUTUBE_VIDEOS[0]);
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  // New video modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [newCategory, setNewCategory] = useState<'Masterclass' | 'Webinar Privado' | 'Estrategia Coach & Admin' | 'Caso Clínico'>('Masterclass');
  const [newDesc, setNewDesc] = useState('');

  const categories = ['Todas', 'Masterclass', 'Webinar Privado', 'Estrategia Coach & Admin', 'Caso Clínico'];

  const filteredVideos = videos.filter(v => filterCategory === 'Todas' || v.category === filterCategory);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newYoutubeUrl.trim()) return;

    // Extract ID if full URL
    let videoId = newYoutubeUrl.trim();
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1]?.split('&')[0] || videoId;
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1]?.split('?')[0] || videoId;
    }

    const created: YouTubeChannelVideo = {
      id: `yt_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Grabación exclusiva para la red de mentores y administradores.',
      youtubeVideoId: videoId,
      youtubeUrl: newYoutubeUrl.trim(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      duration: '45 min',
      coachId: user?.uid || 'coach',
      coachName: user?.displayName || 'Coach',
      coachPhoto: user?.photoURL,
      category: newCategory,
      isLive: false,
      viewCount: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVideos([created, ...videos]);
    setShowAddModal(false);
    setNewTitle('');
    setNewYoutubeUrl('');
    setNewDesc('');
    alert('Video incorporado al canal exclusivo de Coaches & Admin.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock size={12} /> Canal Privado Exclusivo para Coach & Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kira Video Channel & YouTube Studio
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-1">
            Transmisiones en vivo, webinars estratégicos de dirección y casos clínicos reservados para el cuerpo docente y administración de Safeness Inc.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-[#7C5CFF] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all self-start"
        >
          <PlusCircle size={16} /> + Vincular Video YouTube
        </button>
      </div>

      {/* Main Video Cinema Player View */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="relative aspect-video w-full bg-black">
          {/* Real responsive YouTube Embed Iframe or fallback */}
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeVideoId}?autoplay=0&rel=0`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Selected Video Details */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-extrabold uppercase">
                  {selectedVideo.category}
                </span>
                {selectedVideo.isLive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase animate-pulse">
                    <Radio size={12} /> Transmitiendo En Vivo
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">{selectedVideo.duration}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedVideo.title}
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Eye size={15} /> {selectedVideo.viewCount} vistas</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Clock size={15} /> {selectedVideo.createdAt}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/8 pt-4">
            {selectedVideo.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <img src={selectedVideo.coachPhoto} alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-xs text-white font-semibold">Publicado por {selectedVideo.coachName}</span>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              filterCategory === c ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid of Other YouTube Studio Videos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVideos.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelectedVideo(v)}
            className={`glass-panel rounded-3xl border overflow-hidden cursor-pointer group transition-all ${
              selectedVideo.id === v.id ? 'border-[#7C5CFF] shadow-[0_0_30px_rgba(124,92,255,0.25)]' : 'border-white/8 hover:border-white/20'
            }`}
          >
            <div className="relative h-44 overflow-hidden bg-black">
              <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play size={20} className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                {v.duration}
              </div>
            </div>

            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase">{v.category}</span>
              <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#22D3EE] transition-colors">
                {v.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">{v.coachName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleAddVideo} className="w-full max-w-md rounded-3xl bg-[#0B0F17] border border-white/15 p-6 sm:p-8 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Video size={20} className="text-rose-500" /> Vincular Video de YouTube
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Añade un video público, no listado o transmisión en vivo de YouTube para compartir con los coaches y la administración.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Título del Video</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Webinar: Cómo aplicar Session Intelligence"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">URL o ID de YouTube</label>
                <input
                  type="text"
                  required
                  value={newYoutubeUrl}
                  onChange={(e) => setNewYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                >
                  <option value="Masterclass">Masterclass</option>
                  <option value="Webinar Privado">Webinar Privado</option>
                  <option value="Estrategia Coach & Admin">Estrategia Coach & Admin</option>
                  <option value="Caso Clínico">Caso Clínico</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Temas tratados, objetivos y enlaces complementarios..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase"
              >
                Publicar Video
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
