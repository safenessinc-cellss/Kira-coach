import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { getLocalActivityLogs } from '../lib/activityLogger';
import { Users, Search, Download, ShieldCheck, Ban, PlusCircle, CheckCircle2, AlertTriangle, Eye, X } from 'lucide-react';
import { UserProfile } from '../types';

export function AdminUsers() {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'resumen' | 'actividad' | 'alertas'>('resumen');

  const [userList, setUserList] = useState<any[]>([
    {
      uid: 'u_001',
      displayName: 'Roberto De Uwy',
      email: 'deuwyrobert@gmail.com',
      role: 'alumno',
      points: 1250,
      tier: 'Plata',
      status: 'active',
      burnoutScore: 18,
      createdAt: '2026-11-01',
      lastLogin: 'Hace 1 hora'
    },
    {
      uid: 'u_002',
      displayName: 'Dra. Elena Rostova',
      email: 'elena.rostova@kira.coach',
      role: 'coach',
      points: 4200,
      tier: 'Oro',
      status: 'active',
      burnoutScore: 12,
      createdAt: '2026-10-15',
      lastLogin: 'Hace 30 min'
    },
    {
      uid: 'u_003',
      displayName: 'Mariana Duarte',
      email: 'mariana.duarte@empresa.com',
      role: 'alumno',
      points: 320,
      tier: 'Bronce',
      status: 'suspended',
      burnoutScore: 78,
      createdAt: '2026-11-04',
      lastLogin: 'Hace 3 días'
    }
  ]);

  const filtered = userList.filter(u =>
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBan = async (uid: string) => {
    setUserList(prev => prev.map(u => {
      if (u.uid === uid) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    await logAction('points_awarded', { action: 'toggle_user_status', targetUid: uid });
    alert('Estado de cuenta actualizado.');
  };

  const handleAwardPoints = async (uid: string) => {
    const pts = prompt('Cantidad de Energy Points a otorgar:', '100');
    if (pts && !isNaN(Number(pts))) {
      setUserList(prev => prev.map(u => u.uid === uid ? { ...u, points: u.points + Number(pts) } : u));
      await logAction('points_awarded', { targetUid: uid, amount: Number(pts) });
      alert(`Se otorgaron +${pts} Energy Points.`);
    }
  };

  const exportCSV = () => {
    const headers = 'UID,Nombre,Email,Rol,Puntos,Estado,BurnoutScore,Registro\n';
    const rows = userList.map(u =>
      `${u.uid},${u.displayName},${u.email},${u.role},${u.points},${u.status},${u.burnoutScore},${u.createdAt}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kira_usuarios_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const localLogs = getLocalActivityLogs();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
            Administración Central
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Directorio Maestro de Usuarios
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-1">
            Control de cuentas, auditoría inmutable de actividad, otorgamiento de energía y moderación de accesos.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider self-start"
        >
          <Download size={15} /> Exportar CSV
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o correo electrónico..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFF]"
          />
        </div>
      </div>

      {/* Master Users Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="p-4 pl-6">Usuario</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Puntos de Energía</th>
              <th className="p-4">Riesgo Burnout</th>
              <th className="p-4">Estado</th>
              <th className="p-4 pr-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(u => (
              <tr key={u.uid} className="hover:bg-white/2 transition-colors">
                <td className="p-4 pl-6">
                  <p className="font-bold text-white">{u.displayName}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-md bg-[#7C5CFF]/15 text-[#22D3EE] font-bold text-[10px] uppercase">
                    {u.role}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-white">{u.points} Pts</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] font-mono ${
                    u.burnoutScore > 50 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {u.burnoutScore}%
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right space-x-2">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                    title="Ver detalle"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleAwardPoints(u.uid)}
                    className="px-2.5 py-1 rounded-lg bg-[#7C5CFF]/20 hover:bg-[#7C5CFF]/30 text-[#22D3EE] text-xs font-bold"
                  >
                    +Pts
                  </button>
                  <button
                    onClick={() => handleToggleBan(u.uid)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      u.status === 'active' ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {u.status === 'active' ? 'Suspender' : 'Reactivar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B0F17] border border-white/15 p-6 sm:p-8 text-white space-y-6">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-white/8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#22D3EE] flex items-center justify-center text-white text-xl font-bold">
                {selectedUser.displayName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedUser.displayName}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email} · Rol: <strong className="text-[#22D3EE] uppercase">{selectedUser.role}</strong></p>
              </div>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveTab('resumen')}
                className={`text-xs font-bold uppercase ${activeTab === 'resumen' ? 'text-[#22D3EE]' : 'text-slate-400'}`}
              >
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('actividad')}
                className={`text-xs font-bold uppercase ${activeTab === 'actividad' ? 'text-[#22D3EE]' : 'text-slate-400'}`}
              >
                Auditoría Inmutable
              </button>
            </div>

            {activeTab === 'resumen' && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/8">
                  <span className="text-slate-400 block mb-1">Energy Points Acumulados</span>
                  <span className="text-xl font-bold font-mono text-white">{selectedUser.points} Pts</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/8">
                  <span className="text-slate-400 block mb-1">Índice Somático Burnout</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{selectedUser.burnoutScore}%</span>
                </div>
              </div>
            )}

            {activeTab === 'actividad' && (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
                <p className="text-[11px] text-slate-400 mb-2">Logs de eventos auditados (sin texto confidencial de journals o mensajes):</p>
                {localLogs.slice(0, 6).map((log, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] flex justify-between items-center">
                    <span className="font-mono text-[#22D3EE] font-bold">{log.action}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{log.timestamp.slice(0, 16)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
