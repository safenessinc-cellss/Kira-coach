import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SEED_COACHES, SEED_COACH_STORIES, SEED_COACH_POSTS, SEED_BOOKS, SEED_COURSES } from '../lib/seedData';
import { StoryViewerModal } from '../components/StoryViewerModal';
import { Book, Course } from '../types';
import { 
  Grid, 
  BookOpen, 
  GraduationCap, 
  PlusCircle, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Upload, 
  ExternalLink,
  ShoppingBag,
  Share2,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function CoachInstagramProfile() {
  const { user } = useAuth();
  
  // Find current coach profile or use default Elena Rostova
  const coach = SEED_COACHES.find(c => c.uid === user?.uid) || SEED_COACHES[0];

  const [activeTab, setActiveTab] = useState<'posts' | 'books' | 'courses'>('posts');
  const [storiesOpen, setStoriesOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  // New book publishing modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishType, setPublishType] = useState<'book' | 'story'>('book');

  // Book form state
  const [bookTitle, setBookTitle] = useState('');
  const [bookPrice, setBookPrice] = useState(24.99);
  const [bookCategory, setBookCategory] = useState('Neurociencia & Liderazgo');
  const [bookDesc, setBookDesc] = useState('');
  const [coachBooks, setCoachBooks] = useState<Book[]>(SEED_BOOKS.filter(b => b.coachId === coach.uid || b.coachId === 'coach_elena_01'));

  // Story form state
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [stories, setStories] = useState(SEED_COACH_STORIES);

  const highlights = [
    { id: 'h1', title: 'Neurotips', icon: '🧠', count: 12 },
    { id: 'h2', title: 'Calma 4-7-8', icon: '🫁', count: 8 },
    { id: 'h3', title: 'Mis Libros', icon: '📚', count: 3 },
    { id: 'h4', title: 'Webinars', icon: '🎙️', count: 5 },
    { id: 'h5', title: 'Alumnos', icon: '⭐', count: 44 },
  ];

  const handlePublishBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    const newBook: Book = {
      id: `book_${Date.now()}`,
      title: bookTitle.trim(),
      author: coach.displayName || 'Coach',
      coachId: coach.uid,
      coachName: coach.displayName,
      coachPhoto: coach.photoURL,
      description: bookDesc.trim() || 'Guía exclusiva para el dominio de habilidades ontológicas y bienestar.',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      price: Number(bookPrice),
      currency: 'USD',
      pagesCount: 180,
      format: 'PDF',
      category: bookCategory,
      rating: 5.0,
      reviewsCount: 1,
      previewSnippet: 'Capítulo de introducción publicado por el coach.',
      featured: true
    };

    setCoachBooks([newBook, ...coachBooks]);
    setShowPublishModal(false);
    setBookTitle('');
    setBookDesc('');
    alert('¡Libro publicado exitosamente en tu perfil y en la tienda de KIRA 2.1!');
  };

  const handlePublishStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryCaption.trim()) return;

    const newStory = {
      id: `story_${Date.now()}`,
      coachId: coach.uid!,
      coachName: coach.displayName || 'Coach',
      coachPhoto: coach.photoURL || '',
      mediaUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
      mediaType: 'image' as const,
      caption: newStoryCaption.trim(),
      createdAt: 'Hace un momento',
      viewed: false
    };

    setStories([newStory, ...stories]);
    setShowPublishModal(false);
    setNewStoryCaption('');
    alert('¡Historia publicada! Ya está disponible en el círculo de historias de tu perfil.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
            Presencia Social & Marca Personal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Perfil de Coach (Estilo Instagram)
          </h1>
          <p className="text-sm text-slate-400">
            Tu vitrina pública con historias activas, venta de libros, catálogo de cursos y cápsulas de video.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPublishType('story');
              setShowPublishModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
          >
            <PlusCircle size={15} /> + Historia
          </button>

          <button
            onClick={() => {
              setPublishType('book');
              setShowPublishModal(true);
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-all"
          >
            <BookOpen size={15} /> Publicar Libro
          </button>
        </div>
      </div>

      {/* INSTAGRAM PROFILE HEADER */}
      <div className="glass-panel p-6 sm:p-10 rounded-[36px] border border-white/10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar with Story Gradient Ring */}
          <div className="relative group shrink-0 cursor-pointer" onClick={() => { setStoryIndex(0); setStoriesOpen(true); }}>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#7C5CFF] shadow-xl group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full p-1 bg-[#0B0F17]">
                <img
                  src={coach.photoURL}
                  alt={coach.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#EC4899] to-[#7C5CFF] text-[9px] font-black uppercase text-white shadow-md">
              Ver Historia
            </div>
          </div>

          {/* Profile Bio & Counters */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                {coach.displayName}
                <ShieldCheck size={20} className="text-[#22D3EE]" />
              </h2>
              <span className="text-xs text-[#22D3EE] font-mono px-2 py-0.5 rounded-md bg-[#22D3EE]/10 border border-[#22D3EE]/20 self-center">
                @{coach.displayName?.toLowerCase().replace(/[\s\.]+/g, '_') || 'coach'}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8 text-xs">
              <div>
                <span className="font-mono font-black text-white text-base block">{SEED_COACH_POSTS.length}</span>
                <span className="text-slate-400">Publicaciones</span>
              </div>
              <div>
                <span className="font-mono font-black text-white text-base block">{coachBooks.length}</span>
                <span className="text-slate-400">Libros</span>
              </div>
              <div>
                <span className="font-mono font-black text-white text-base block">2</span>
                <span className="text-slate-400">Cursos</span>
              </div>
              <div>
                <span className="font-mono font-black text-amber-300 text-base block flex items-center gap-1 justify-center md:justify-start">
                  <Star size={14} className="fill-amber-300" /> {coach.rating || 4.9}
                </span>
                <span className="text-slate-400">{coach.reviewsCount || 44} valoraciones</span>
              </div>
            </div>

            {/* Bio text */}
            <div className="space-y-1 text-xs text-slate-300 max-w-lg leading-relaxed">
              <p className="font-bold text-white">{coach.specialty}</p>
              <p>{coach.bio}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-[11px] text-[#22D3EE]">
                <span>🌐 Sesiones en {coach.languages?.join(', ')}</span>
                <span>•</span>
                <span>💎 Mentor Verificado por Safeness Inc.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Story Highlights */}
        <div className="mt-8 pt-6 border-t border-white/8 flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {highlights.map((h, i) => (
            <div
              key={h.id}
              onClick={() => { setStoryIndex(i % stories.length); setStoriesOpen(true); }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-white/10 to-white/30 group-hover:from-[#7C5CFF] group-hover:to-[#22D3EE] transition-all">
                <div className="w-full h-full rounded-full bg-[#0B0F17] flex items-center justify-center text-xl">
                  {h.icon}
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors">
                {h.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/10 justify-center gap-8">
        {[
          { id: 'posts', label: 'Publicaciones & Reels', icon: Grid },
          { id: 'books', label: `Libros en Venta (${coachBooks.length})`, icon: BookOpen },
          { id: 'courses', label: 'Cursos Activos (2)', icon: GraduationCap },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                isActive ? 'border-[#7C5CFF] text-[#22D3EE]' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: INSTAGRAM POSTS GRID */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SEED_COACH_POSTS.map(post => (
            <div
              key={post.id}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer bg-slate-900 border border-white/8"
            >
              <img
                src={post.imageUrl}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 text-white">
                <p className="text-xs line-clamp-3 leading-relaxed">{post.caption}</p>
                <div className="flex items-center gap-4 text-xs font-mono font-bold mt-auto">
                  <span className="flex items-center gap-1.5"><Heart size={14} className="fill-white" /> {post.likesCount}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {post.commentsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BOOKS FOR SALE */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coachBooks.map(book => (
            <div key={book.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row gap-5 items-center">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-28 sm:w-32 h-40 sm:h-44 object-cover rounded-2xl shadow-xl shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between h-full space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-[#22D3EE] uppercase tracking-wider">{book.category}</span>
                  <h3 className="text-base font-bold text-white leading-snug mt-1">{book.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{book.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/8">
                  <div>
                    <span className="text-lg font-black font-mono text-white">${book.price}</span>
                    <span className="text-[10px] text-slate-400 block">{book.format} · {book.pagesCount} págs</span>
                  </div>

                  <Link
                    to="/dashboard/books"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag size={13} /> Ver en Tienda
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COACH COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_COURSES.slice(0, 2).map(c => (
            <div key={c.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-4">
              <img src={c.imageUrl} alt="" className="w-24 h-24 rounded-2xl object-cover shrink-0" />
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-[#7C5CFF] uppercase">{c.category}</span>
                <h3 className="text-base font-bold text-white">{c.title}</h3>
                <p className="text-xs text-slate-400">${c.price} USD · {c.durationHours} horas</p>
                <Link
                  to="/coach/courses"
                  className="inline-block pt-1 text-xs font-bold text-[#22D3EE] hover:underline"
                >
                  Gestionar en Editor de Cursos →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Publishing Book or Story */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0B0F17] border border-white/15 p-6 sm:p-8 text-white space-y-4">
            <h3 className="text-lg font-bold">
              {publishType === 'book' ? 'Publicar Nuevo Libro a la Venta' : 'Añadir Nueva Historia'}
            </h3>
            <p className="text-xs text-slate-400">
              {publishType === 'book'
                ? 'Monetiza tu experiencia con e-books y manuales con pasarela de pagos integrada.'
                : 'Comparte un micro-consejo, foto o reflexión que expirará en 24 horas.'}
            </p>

            {publishType === 'book' ? (
              <form onSubmit={handlePublishBook} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Título del Libro</label>
                  <input
                    type="text"
                    required
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="Ej: Neurofeedback y Rendimiento Ejecutivo"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Precio ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={bookPrice}
                      onChange={(e) => setBookPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Categoría</label>
                    <select
                      value={bookCategory}
                      onChange={(e) => setBookCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                    >
                      <option value="Neurociencia & Liderazgo">Neurociencia</option>
                      <option value="Coaching Ontológico">Coaching Ontológico</option>
                      <option value="Arteterapia">Arteterapia</option>
                      <option value="Salud & Bienestar">Salud & Bienestar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Descripción Breve</label>
                  <textarea
                    rows={3}
                    value={bookDesc}
                    onChange={(e) => setBookDesc(e.target.value)}
                    placeholder="Resumen del contenido y beneficios prácticos..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase"
                  >
                    Poner a la Venta
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePublishStory} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Texto de la Historia</label>
                  <textarea
                    rows={4}
                    required
                    value={newStoryCaption}
                    onChange={(e) => setNewStoryCaption(e.target.value)}
                    placeholder="Escribe tu consejo somático o reflexión rápida..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#7C5CFF] text-white font-black text-xs uppercase"
                  >
                    Publicar Historia
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Story Viewer Component */}
      <StoryViewerModal
        stories={stories}
        initialIndex={storyIndex}
        isOpen={storiesOpen}
        onClose={() => setStoriesOpen(false)}
      />
    </div>
  );
}
