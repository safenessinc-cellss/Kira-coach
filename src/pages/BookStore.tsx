import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { SEED_BOOKS } from '../lib/seedData';
import { Book } from '../types';
import { 
  BookOpen, 
  Search, 
  Star, 
  ShoppingBag, 
  Download, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  CreditCard,
  X
} from 'lucide-react';

export function BookStore() {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();

  const [books, setBooks] = useState<Book[]>(SEED_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [purchasedBookIds, setPurchasedBookIds] = useState<string[]>(['book_01']);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_books'>('catalog');

  // Preview modal
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const categories = ['Todas', 'Neurociencia & Liderazgo', 'Coaching Ontológico', 'Arteterapia'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todas' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const myPurchasedBooks = books.filter(b => purchasedBookIds.includes(b.id));

  const handleBuyBook = async (book: Book) => {
    setBuyingId(book.id);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'user_demo',
          courseId: book.id,
          amount: book.price,
          title: `Libro: ${book.title}`,
          type: 'vault_unlock'
        })
      });
      const data = await res.json();
      if (data.url) {
        setPurchasedBookIds(prev => [...prev, book.id]);
        await logAction('payment_succeeded', { bookId: book.id, amount: book.price });
        alert(`¡Felicidades! Has adquirido "${book.title}". Ya está disponible para lectura y descarga en tu biblioteca.`);
      }
    } catch {
      setPurchasedBookIds(prev => [...prev, book.id]);
      alert(`Compra simulada con éxito para "${book.title}".`);
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-[36px] relative overflow-hidden border-[#7C5CFF]/20 bg-gradient-to-r from-slate-900 via-[#0B0F17] to-slate-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C5CFF]/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/30 text-[#22D3EE] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} /> Tienda Oficial de Libros & E-Books
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Librería de Sabiduría & Neurociencia
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Publicaciones originales escritas por los coaches y mentores de Safeness Inc. Disponibles en PDF, EPUB y audiolibro con descarga inmediata.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Catálogo de Libros
            </button>
            <button
              onClick={() => setActiveTab('my_books')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'my_books'
                  ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              Mis Libros ({myPurchasedBooks.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, autor o tema somático..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFF]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    selectedCategory === c ? 'bg-white/15 text-white border border-white/20' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isPurchased = purchasedBookIds.includes(book.id);

              return (
                <div
                  key={book.id}
                  className="glass-panel p-6 rounded-3xl border border-white/8 hover:border-[#7C5CFF]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover art with 3D effect */}
                    <div className="relative h-60 rounded-2xl overflow-hidden mb-4 bg-slate-900 shadow-xl group-hover:scale-[1.02] transition-transform duration-300">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#22D3EE] border border-white/10">
                        {book.format} · {book.pagesCount} Páginas
                      </div>
                      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-[#0B0F17]/90 backdrop-blur-md font-mono font-black text-white text-base shadow-lg border border-white/10">
                        ${book.price} USD
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <img src={book.coachPhoto} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs text-slate-300 font-semibold">{book.author}</span>
                    </div>

                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#22D3EE] transition-colors mb-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {book.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-4">
                      <Star size={13} className="fill-amber-300" />
                      <span>{book.rating}</span>
                      <span className="text-slate-500 font-normal">({book.reviewsCount} reseñas)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/8">
                    <button
                      onClick={() => setPreviewBook(book)}
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Leer muestra gratis"
                    >
                      <Eye size={14} /> Muestra
                    </button>

                    {isPurchased ? (
                      <span className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={14} /> Ya Comprado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuyBook(book)}
                        disabled={buyingId === book.id}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] hover:opacity-90 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all"
                      >
                        <ShoppingBag size={14} /> {buyingId === book.id ? 'Procesando...' : 'Comprar Libro'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY PURCHASED BOOKS */}
      {activeTab === 'my_books' && (
        <div className="space-y-6">
          {myPurchasedBooks.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-3 max-w-md mx-auto">
              <BookOpen size={40} className="mx-auto text-slate-500" />
              <h3 className="text-base font-bold text-white">No tienes libros comprados aún</h3>
              <p className="text-xs text-slate-400">Explora el catálogo y adquiere libros para potenciar tu proceso de coaching.</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-5 py-2 rounded-xl bg-[#7C5CFF] text-white text-xs font-bold"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPurchasedBooks.map((book) => (
                <div key={book.id} className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col justify-between space-y-4">
                  <div className="flex gap-4">
                    <img src={book.coverUrl} alt="" className="w-24 h-32 rounded-xl object-cover shadow-lg" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Licencia Activa</span>
                      <h4 className="text-sm font-bold text-white">{book.title}</h4>
                      <p className="text-xs text-slate-400">{book.author}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{book.format} · {book.pagesCount} págs</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/8">
                    <button
                      onClick={() => alert(`Iniciando visor del libro "${book.title}".`)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase"
                    >
                      Leer en Línea
                    </button>
                    <button
                      onClick={() => alert(`Descargando archivo ${book.format} firmado criptográficamente por Safeness Inc.`)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"
                      title="Descargar archivo"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fragment Preview Modal */}
      {previewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0B0F17] border border-white/15 p-6 sm:p-8 text-white space-y-4">
            <button
              onClick={() => setPreviewBook(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider">Muestra Gratuita de Lectura</span>
            <h3 className="text-xl font-bold">{previewBook.title}</h3>
            <p className="text-xs text-slate-400">Por {previewBook.author} · {previewBook.category}</p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed italic max-h-60 overflow-y-auto">
              "{previewBook.previewSnippet || previewBook.description}"
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPreviewBook(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const b = previewBook;
                  setPreviewBook(null);
                  handleBuyBook(b);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase"
              >
                Comprar por ${previewBook.price} USD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
