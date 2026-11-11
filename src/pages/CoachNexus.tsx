import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Users, Search, Award, CheckCircle2, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CoachNexus() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const sampleStudents = [
    {
      id: 'st_01',
      name: 'Roberto De Uwy',
      email: 'deuwyrobert@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      courseTitle: 'Biología del Éxito & Calma Interior',
      progress: 92,
      lastActive: 'Hace 2 horas',
      tier: 'Plata',
      coherenceStreak: 6,
      completedLessons: 4,
      totalLessons: 4,
      certificateStatus: 'active'
    },
    {
      id: 'st_02',
      name: 'Camila Morales',
      email: 'camila.morales@empresa.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      courseTitle: 'Biología del Éxito & Calma Interior',
      progress: 65,
      lastActive: 'Ayer',
      tier: 'Bronce',
      coherenceStreak: 3,
      completedLessons: 2,
      totalLessons: 4,
      certificateStatus: 'in_progress'
    },
    {
      id: 'st_03',
      name: 'Ignacio Duarte',
      email: 'ignacio.duarte@startup.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      courseTitle: 'Maestría en Coaching Ontológico & Liderazgo',
      progress: 40,
      lastActive: 'Hace 3 días',
      tier: 'Bronce',
      coherenceStreak: 1,
      completedLessons: 2,
      totalLessons: 5,
      certificateStatus: 'in_progress'
    }
  ];

  const filtered = sampleStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#22D3EE] uppercase">
          Comunidad de Aprendizaje
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Nexus — Trazabilidad de Estudiantes
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Supervisa el progreso académico, lecciones completadas y coherencia de tus alumnos asignados sin vulnerar su privacidad íntima.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar estudiante por nombre o curso..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7C5CFF]"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Total asignados: <strong className="text-white">{sampleStudents.length}</strong>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4 pl-6">Estudiante</th>
                <th className="p-4">Programa</th>
                <th className="p-4">Progreso</th>
                <th className="p-4">Racha Coherente</th>
                <th className="p-4">Última Actividad</th>
                <th className="p-4 pr-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{s.courseTitle}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] rounded-full"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-white font-bold">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[11px]">
                      {s.coherenceStreak} días
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-[11px] font-mono">{s.lastActive}</td>
                  <td className="p-4 pr-6 text-right">
                    <Link
                      to={`/coach/messages?studentId=${s.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold transition-colors"
                    >
                      <MessageSquare size={14} /> Mensaje
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
