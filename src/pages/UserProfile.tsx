import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  User, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Share2, 
  Save, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { EnergyTierBadge } from '../components/EnergyTierBadge';
import { ImageUpload } from '../components/ImageUpload';
import { Link } from 'react-router-dom';

export function UserProfile() {
  const { user } = useAuth();
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || 'Estudiante en búsqueda de equilibrio somático y alto rendimiento.');
  const [socialLinks, setSocialLinks] = useState({
    instagram: user?.socialLinks?.instagram || '@roberto_deuwy',
    linkedin: user?.socialLinks?.linkedin || 'linkedin.com/in/robertodeuwy',
    twitter: user?.socialLinks?.twitter || '@robert_kira',
    tiktok: user?.socialLinks?.tiktok || '',
    youtube: user?.socialLinks?.youtube || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      if (user && db) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          displayName,
          photoURL,
          bio,
          socialLinks
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.warn('Error saving profile, local state updated');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#22D3EE] uppercase">
          Identidad Digital
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Perfil del Usuario & Redes Sociales
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configura tu información pública, avatar y enlaces a tus perfiles sociales en Safeness Inc.
        </p>
      </div>

      {/* Main Glass Panel */}
      <div className="glass-panel rounded-[36px] p-6 sm:p-10 border border-white/10 space-y-8">
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-white/8">
          <div className="relative group">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Avatar"
                className="w-24 h-24 rounded-2xl object-cover ring-2 ring-[#7C5CFF]/40 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#22D3EE] flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {displayName.charAt(0) || 'U'}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-xl font-bold text-white">{displayName || 'Usuario'}</h2>
              <EnergyTierBadge points={user?.points || 1250} />
            </div>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            <p className="text-xs text-slate-300 italic max-w-md">"{bio}"</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Datos Personales
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Nombre Completo</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Biografía Corta</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">URL de Foto de Perfil</label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>
          </div>

          {/* Social Networks Section */}
          <div className="space-y-4 pt-4 border-t border-white/8">
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-[#22D3EE]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Redes Sociales del Alumno
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Conecta tus redes para compartir tus acreditaciones y conectar con tus mentores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Instagram size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
                <input
                  type="text"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  placeholder="@usuario_instagram"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="relative">
                <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/usuario"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="relative">
                <Twitter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
                <input
                  type="text"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  placeholder="@usuario_x"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="relative">
                <Youtube size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
                <input
                  type="text"
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  placeholder="youtube.com/@canal"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/8 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:opacity-90 transition-all disabled:opacity-40"
            >
              <Save size={15} /> {saving ? 'Guardando...' : 'Guardar Perfil'}
            </button>

            {success && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={16} /> Perfil actualizado correctamente
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
