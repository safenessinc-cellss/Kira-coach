import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SEED_COACHES } from '../lib/seedData';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { useSearchParams } from 'react-router-dom';
import { Send, ShieldAlert, Paperclip, CheckCircle2, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

export function StudentMessages() {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();
  const [searchParams] = useSearchParams();

  const initialCoachId = searchParams.get('coachId') || SEED_COACHES[0].uid;
  const [selectedCoachId, setSelectedCoachId] = useState(initialCoachId);

  const activeCoach = SEED_COACHES.find((c) => c.uid === selectedCoachId) || SEED_COACHES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      chatId: 'chat_default',
      senderId: activeCoach.uid!,
      senderName: activeCoach.displayName || 'Coach',
      senderRole: 'coach',
      text: '¡Hola Roberto! He revisado tus últimos registros somáticos y el balance de respiración. ¿Cómo te has sentido con la práctica 4-7-8 esta semana?',
      createdAt: '10:14 AM',
      read: true
    },
    {
      id: 'm2',
      chatId: 'chat_default',
      senderId: user?.uid || 'user_student_demo',
      senderName: user?.displayName || 'Roberto',
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId: `chat_${selectedCoachId}`,
      senderId: user?.uid || 'student',
      senderName: user?.displayName || 'Alumno',
      senderRole: 'alumno',
      text: inputText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    await logAction('message_sent', { recipientCoachId: selectedCoachId });

    // Simulate smart coach echo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `coach_reply_${Date.now()}`,
          chatId: `chat_${selectedCoachId}`,
          senderId: activeCoach.uid!,
          senderName: activeCoach.displayName || 'Coach',
          senderRole: 'coach',
          text: 'Exactamente. El secreto está en sostener la regularidad antes de que aparezca el pico de fatiga. Continúa así.',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true
        }
      ]);
    }, 1200);
  };

  const handleReport = () => {
    const reason = prompt('Indica el motivo del reporte para moderación:');
    if (reason) {
      logAction('report_filed', { reportedUserId: activeCoach.uid, reason });
      alert('Reporte enviado al equipo de seguridad de Safeness Inc.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#22D3EE] uppercase">
          Comunicación Directa
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Mensajes & Mentoría 1-a-1
        </h1>
        <p className="text-sm text-slate-400">
          Canal cifrado y moderado de orientación académica con tus mentores asignados.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh]">
        {/* Coaches list tab */}
        <div className="border-r border-white/8 p-4 flex flex-col space-y-2 overflow-y-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
            Mentores Activos
          </span>

          {SEED_COACHES.map((coach) => {
            const isSelected = coach.uid === selectedCoachId;
            return (
              <button
                key={coach.uid}
                onClick={() => setSelectedCoachId(coach.uid!)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all ${
                  isSelected ? 'bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 text-white' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <img src={coach.photoURL} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{coach.displayName}</h4>
                  <p className="text-[11px] text-[#22D3EE] truncate">{coach.specialty}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col justify-between bg-[#0B0F17]/40 h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeCoach.photoURL} alt="" className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h3 className="text-sm font-bold text-white">{activeCoach.displayName}</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Disponible
                </span>
              </div>
            </div>

            <button
              onClick={handleReport}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Reportar mensaje a moderación"
            >
              <ShieldAlert size={14} /> Reportar
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
            {messages.map((m) => {
              const isMe = m.senderRole === 'alumno';
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                      isMe
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

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/8 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta ontológica o pregunta sobre tus hábitos..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-bold disabled:opacity-40 transition-all shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
