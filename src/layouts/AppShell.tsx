import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Brand';
import { EnergyTierBadge } from '../components/EnergyTierBadge';
import { GlobalFooter } from '../components/GlobalFooter';
import { CalmProtocolFAB } from '../components/CalmProtocolFAB';
import { AIChat } from '../components/AIChat';
import { 
  Home, 
  BookOpen, 
  PenTool, 
  Sparkles, 
  Award, 
  Users, 
  MessageSquare, 
  Heart, 
  Settings, 
  Activity, 
  Bot, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  ShieldAlert, 
  Palette, 
  Lightbulb, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  User, 
  Building2,
  Compass
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';

export function AppShell() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(2);
  const [pendingCoachesCount, setPendingCoachesCount] = useState(1);
  const [pendingCertsCount, setPendingCertsCount] = useState(3);
  const [brandSettings, setBrandSettings] = useState({
    primaryColor: '#7C5CFF',
    secondaryColor: '#22D3EE',
    appName: 'KIRA 2.1'
  });

  // Load website theme settings
  useEffect(() => {
    try {
      if (db) {
        const unsub = onSnapshot(doc(db, 'settings', 'website'), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setBrandSettings((prev) => ({ ...prev, ...data }));
            if (data.primaryColor) {
              document.documentElement.style.setProperty('--primary', data.primaryColor);
            }
            if (data.secondaryColor) {
              document.documentElement.style.setProperty('--accent', data.secondaryColor);
            }
          }
        });
        return () => unsub();
      }
    } catch {
      // Offline fallback
    }
  }, []);

  // Real-time unread messages
  useEffect(() => {
    if (!user || !db) return;
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid)
      );
      const unsub = onSnapshot(q, (snap) => {
        let unread = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.unreadCounts && data.unreadCounts[user.uid]) {
            unread += Number(data.unreadCounts[user.uid]) || 0;
          }
        });
        setUnreadMessagesCount(unread || 2); // default demo badge if new
      });
      return () => unsub();
    } catch {
      // Offline fallback
    }
  }, [user]);

  // Admin pending counts
  useEffect(() => {
    if (role !== 'admin' || !db) return;
    try {
      const qCoach = query(collection(db, 'coach_applications'), where('status', '==', 'pending'));
      const unsubCoach = onSnapshot(qCoach, (snap) => setPendingCoachesCount(snap.size || 1));

      const qCert = query(collection(db, 'certificates'), where('status', '==', 'pending_admin'));
      const unsubCert = onSnapshot(qCert, (snap) => setPendingCertsCount(snap.size || 2));

      return () => {
        unsubCoach();
        unsubCert();
      };
    } catch {
      // fallback
    }
  }, [role]);

  // Define navigation items strictly by role
  const getNavItems = () => {
    if (role === 'coach') {
      return [
        { to: '/coach', label: 'Command Center', icon: Activity },
        { to: '/coach/instagram-profile', label: 'Mi Perfil Instagram', icon: Compass },
        { to: '/coach/youtube-channel', label: 'Canal YouTube Studio', icon: Building2 },
        { to: '/coach/courses', label: 'Editor de Cursos', icon: BookOpen },
        { to: '/coach/session', label: 'Session Intelligence', icon: Sparkles },
        { to: '/coach/ai-copilot', label: 'Coach Copilot (IA)', icon: Bot },
        { to: '/coach/nexus', label: 'Nexus (Estudiantes)', icon: Users },
        { to: '/coach/messages', label: 'Mensajes', icon: MessageSquare, badge: unreadMessagesCount },
        { to: '/coach/profile', label: 'Mi Perfil & Redes', icon: User },
      ];
    }

    if (role === 'admin') {
      return [
        { to: '/admin', label: 'Analytics', icon: BarChart3 },
        { to: '/admin/users', label: 'Usuarios', icon: Users },
        { to: '/admin/coach-approvals', label: 'Coach Approvals', icon: CheckCircle2, badge: pendingCoachesCount },
        { to: '/admin/certificate-approvals', label: 'Certificate Approvals', icon: Award, badge: pendingCertsCount },
        { to: '/admin/payments', label: 'Pagos y Pasarela', icon: CreditCard },
        { to: '/dashboard/books', label: 'Tienda de Libros', icon: BookOpen },
        { to: '/coach/youtube-channel', label: 'Canal YouTube Studio', icon: Building2 },
        { to: '/admin/moderation', label: 'Moderación', icon: ShieldAlert },
        { to: '/admin/branding', label: 'Branding (White-label)', icon: Palette },
        { to: '/admin/insights', label: 'Insights IA', icon: Lightbulb },
        { to: '/admin/settings', label: 'Configuración', icon: Settings },
      ];
    }

    if (role === 'hr_admin') {
      return [
        { to: '/hr', label: 'HR Dashboard', icon: Building2 },
        { to: '/hr/settings', label: 'Configuración', icon: Settings },
      ];
    }

    // Default Alumno
    return [
      { to: '/dashboard', label: 'Dashboard', icon: Home },
      { to: '/dashboard/courses', label: 'Mis Cursos', icon: BookOpen },
      { to: '/dashboard/books', label: 'Tienda de Libros', icon: Sparkles },
      { to: '/dashboard/journal', label: 'Journal (con IA)', icon: PenTool },
      { to: '/dashboard/elite-library', label: 'Bóveda Élite', icon: Award },
      { to: '/dashboard/certificates', label: 'Certificados', icon: CheckCircle2 },
      { to: '/dashboard/coaches', label: 'Directorio Coaches', icon: Compass },
      { to: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare, badge: unreadMessagesCount },
      { to: '/dashboard/progress', label: 'Progreso y Medallas', icon: ShieldCheck },
      { to: '/dashboard/wellness', label: 'Bienestar y Calma', icon: Heart },
      { to: '/dashboard/profile', label: 'Mi Perfil & Redes', icon: User },
      { to: '/dashboard/settings', label: 'Configuración', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  // Mobile bottom bar items (first 4)
  const mobilePrimaryNav = navItems.slice(0, 3);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100 font-sans">
      {/* DESKTOP & TABLET SIDEBAR */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r border-white/8 bg-[#0B0F17]/95 backdrop-blur-2xl transition-all duration-300 z-30 shrink-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/8">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <Logo size={36} withText={!collapsed} />
          </Link>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Info Capsule */}
        <div className="p-3 border-b border-white/8">
          <div className={cn(
            "p-2.5 rounded-2xl bg-white/5 border border-white/8 flex items-center gap-3",
            collapsed && "justify-center p-2"
          )}>
            <div className="relative shrink-0">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="avatar" 
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-[#7C5CFF]/40" 
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#22D3EE] flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0F17]" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.displayName || 'Usuario'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#22D3EE] px-1.5 py-0.2 rounded bg-[#22D3EE]/10 border border-[#22D3EE]/20">
                    {role || 'alumno'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {!collapsed && role === 'alumno' && (
            <div className="mt-2.5 px-1">
              <EnergyTierBadge points={user?.points || 120} showProgress />
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (location.pathname.startsWith(item.to + '/') && item.to !== '/admin' && item.to !== '/coach' && item.to !== '/dashboard');
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 relative group",
                  isActive 
                    ? "bg-[#7C5CFF]/15 text-white border border-[#7C5CFF]/40 shadow-[0_0_20px_rgba(124,92,255,0.15)] font-bold" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent",
                  collapsed && "justify-center px-0 py-3"
                )}
              >
                <Icon 
                  size={18} 
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-[#22D3EE]" : "text-slate-400 group-hover:text-white"
                  )} 
                />

                {!collapsed && (
                  <span className="truncate flex-1">
                    {item.label}
                  </span>
                )}

                {/* Badge indicator */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    "rounded-full bg-[#7C5CFF] text-white text-[10px] font-black flex items-center justify-center shadow-sm",
                    collapsed 
                      ? "absolute top-1.5 right-1.5 w-4 h-4 text-[9px]" 
                      : "px-1.5 py-0.5 min-w-[18px] h-[18px]"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-white/8 space-y-2">
          <button
            onClick={() => logout()}
            title={collapsed ? "Cerrar Sesión" : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent transition-all",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85%] bg-[#0B0F17] border-r border-white/10 h-full p-5 flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <Logo size={32} withText />
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 border-b border-white/8">
              <p className="text-xs font-bold text-white truncate">{user?.displayName}</p>
              <p className="text-[11px] text-[#22D3EE] font-mono capitalize">{role || 'alumno'}</p>
              {role === 'alumno' && (
                <div className="mt-2">
                  <EnergyTierBadge points={user?.points || 120} />
                </div>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all",
                      isActive ? "bg-[#7C5CFF]/20 text-[#22D3EE] font-bold" : "text-slate-300 hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#7C5CFF] text-white font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => logout()}
              className="mt-auto pt-4 border-t border-white/8 flex items-center gap-2 text-rose-400 text-xs font-bold"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-8 border-b border-white/8 bg-[#0B0F17]/80 backdrop-blur-xl flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {role === 'admin' ? 'Centro de Mando Ejecutivo' : role === 'coach' ? 'Academic Command Center' : 'Ecosistema de Bienestar y Aprendizaje'}
              </span>
            </div>
          </div>

          {/* Quick Right Actions */}
          <div className="flex items-center gap-3">
            {role === 'alumno' && (
              <EnergyTierBadge points={user?.points || 120} />
            )}

            {/* Role switch pill for instant validation in dev/preview */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8 text-[10px] font-mono">
              <span className="text-slate-400 px-1.5">Rol:</span>
              <span className="px-2 py-0.5 rounded-lg bg-[#7C5CFF]/20 text-[#22D3EE] font-bold uppercase">
                {role}
              </span>
            </div>

            <Link
              to={role === 'coach' ? '/coach/messages' : '/dashboard/messages'}
              className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Mensajes"
            >
              <MessageSquare size={16} />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7C5CFF] text-[9px] font-black text-white flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </Link>

            <Link
              to={role === 'coach' ? '/coach/profile' : role === 'admin' ? '/admin/settings' : '/dashboard/settings'}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Ajustes"
            >
              <Settings size={16} />
            </Link>
          </div>
        </header>

        {/* Dynamic Outlet Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-between scrollbar-thin">
          <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto pb-28 md:pb-12">
            <Outlet />
          </div>

          {/* Mandatory Safeness Inc Global Footer */}
          <GlobalFooter />
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B0F17]/95 border-t border-white/10 backdrop-blur-xl flex items-center justify-around px-2 z-40">
        {mobilePrimaryNav.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors",
                isActive ? "text-[#22D3EE]" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-200"
        >
          <Menu size={18} />
          <span className="text-[10px] font-medium tracking-tight">Más</span>
        </button>
      </nav>

      {/* Floating Calm Protocol FAB (Always visible in authenticated routes) */}
      <CalmProtocolFAB />

      {/* Floating Contextual Kira Neural Core AI Chat */}
      <AIChat />
    </div>
  );
}
