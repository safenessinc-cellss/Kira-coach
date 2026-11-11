import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Send, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import { ChatMessage } from '../types';

export function CoachMessages() {
  const { user } = useAuth();

  const students = [
    {
      id: 'user_student_demo',
      name: 'Roberto De Uwy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      lastMessage: 'Hola Dra. Elena. Ha sido revelador notar cómo disminuye la tensión...',
      time: '10:20 AM'
    },
    {
      id: 'st_02',
      name: 'Camila Morales',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      lastMessage: 'Muchas gracias por la recomendación sobre el sueño circadiano.',
      time: 'Ayer'
    }
  ];

  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      chatId: 'chat_roberto',
      senderId: user?.uid || 'coach',
      senderName: user?.displayName || 'Coach',
      senderRole: 'coach',
      text: '¡Hola Roberto! He revisado tus últimos registros somáticos y el balance de respiración. ¿Cómo te has sentido con la práctica 4-7-8 esta semana?',
      createdAt: '10:14 AM',
      read: true
    },
    {
      id: 'm2',
      chatId: 'chat_roberto',
      senderId: 'user_student_demo',
      senderName: 'Roberto De Uwy',
      senderRole: 'alumno',
      text: 'Hola Dra. Elena. Ha sido revelador notar cómo disminuye la tensión en el cuello cuando hago las dos inhalaciones cortas del suspiro fisiológico.',
      createdAt: '10:20 AM',
      read: true
    }
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `coach_msg_${Date.now()}`,
        chatId: `chat_${selectedStudentId}`,
        senderId: user?.uid || 'coach',
        senderName: user?.displayName || 'Coach',
        senderRole: 'coach',
        text: inputText.trim(),
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      }
    ]);
    setInputText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Canal Pedagógico
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Mensajería con Alumnos Asignados
        </h1>
        <p className="text-sm text-slate-400">
          Orientación directa y acompañamiento socrático para tus estudiantes inscritos.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh]">
        {/* Students list */}
        <div className="border-r border-white/8 p-4 flex flex-col space-y-2 overflow-y-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
            Conversaciones Activas
          </span>

          {students.map((st) => {
            const isSelected = st.id === selectedStudentId;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStudentId(st.id)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all ${
                  isSelected ? 'bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 text-white' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <img src={st.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{st.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{st.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat area */}
        <div className="md:col-span-2 flex flex-col justify-between bg-[#0B0F17]/40 h-full">
          <div className="p-4 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeStudent.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h3 className="text-sm font-bold text-white">{activeStudent.name}</h3>
                <span className="text-[10px] text-slate-400">Alumno en seguimiento activo</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
            {messages.map((m) => {
              const isCoach = m.senderRole === 'coach';
              return (
                <div key={m.id} className={`flex ${isCoach ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                      isCoach
                        ? 'bg-gradient-to-r from-[#7C5CFF] to-[#6366F1] text-white rounded-br-none shadow-md'
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-mono mb-1">
                      <span className="font-bold">{m.senderName}</span>
                      <span>{m.createdAt}</span>
                    </div>
                    <p>{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-white/8 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu orientación pedagógica..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-bold disabled:opacity-40 shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
