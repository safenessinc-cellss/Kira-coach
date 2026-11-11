import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SEED_COURSES } from '../lib/seedData';
import { Course, CourseLesson } from '../types';
import { BookOpen, CheckCircle2, Play, Bot, ArrowRight, Star, Award, Sparkles, MessageSquare, X, Send } from 'lucide-react';

export function StudentCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['les_1']);
  
  // Socratic AI Tutor Drawer state
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMessages, setTutorMessages] = useState<{ role: 'user' | 'tutor'; text: string }[]>([
    {
      role: 'tutor',
      text: '¡Hola! Soy tu Tutor Socrático de KIRA. Te acompaño a reflexionar y conectar los conceptos con tu experiencia real. ¿Qué duda o perspectiva te surge sobre esta lección?'
    }
  ]);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  // Quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleOpenCourse = (course: Course) => {
    setActiveCourse(course);
    if (course.modules && course.modules[0]?.lessons[0]) {
      setActiveLesson(course.modules[0].lessons[0]);
    }
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleSendTutorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorInput.trim() || tutorLoading) return;

    const userText = tutorInput.trim();
    setTutorMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setTutorInput('');
    setTutorLoading(true);

    try {
      const prompt = `Eres el Tutor Socrático oficial de KIRA 2.1 (Safeness Inc.). 
Estás acompañando al alumno en el curso "${activeCourse?.title || 'General'}" y la lección "${activeLesson?.title || 'General'}".
REGLAS ESTRICTAS:
1. Sé Socrático: Guía con preguntas reflexivas y analogías poderosas.
2. NUNCA des respuestas directas a exámenes o preguntas de opción múltiple; haz preguntas que le permitan al alumno deducir la respuesta por sí mismo.
3. Tono: Cálido, empático, profesional y profundo.
Pregunta del alumno: ${userText}`;

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setTutorMessages((prev) => [...prev, { role: 'tutor', text: data.text }]);
          setTutorLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Tutor AI fallback:', err);
    }

    // Intelligent fallback response
    setTimeout(() => {
      setTutorMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          text: `Observa lo que planteas: "${userText}". Si tuvieras que mirar la situación desde la perspectiva del sistema nervioso o de tus declaraciones ontológicas, ¿qué juicio previo estás dando por hecho sin verificarlo?`
        }
      ]);
      setTutorLoading(false);
    }, 800);
  };

  // If a course is currently opened in classroom mode
  if (activeCourse && activeLesson) {
    const totalLessons = activeCourse.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
    const courseCompleted = (completedLessons.length / totalLessons) >= 1;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/8">
          <div>
            <button
              onClick={() => setActiveCourse(null)}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 mb-1"
            >
              ← Volver al catálogo
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-white">{activeCourse.title}</h1>
          </div>

          <button
            onClick={() => setTutorOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C5CFF]/20 hover:bg-[#7C5CFF]/30 border border-[#7C5CFF]/40 text-[#22D3EE] font-bold text-xs transition-all shadow-md"
          >
            <Bot size={16} /> Preguntar al Tutor IA
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Lesson Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[#22D3EE] font-bold">Lección {activeLesson.order}</span>
                <span>{activeLesson.durationMinutes} minutos de estudio reflexivo</span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">
                {activeLesson.title}
              </h2>

              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
                <p>{activeLesson.content}</p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 my-4">
                  <h4 className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-2">
                    Objetivo Somático de la Sesión
                  </h4>
                  <p className="text-xs text-slate-300">
                    Alinear la respiración diafragmática con la atención focalizada antes de pasar a la evaluación.
                  </p>
                </div>
              </div>

              {/* Interactive Lesson Quiz if present */}
              {activeLesson.quiz && (
                <div className="mt-8 p-6 rounded-2xl bg-[#0B0F17] border border-[#7C5CFF]/30 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C5CFF]">
                    <Sparkles size={16} /> Evaluación Formativa
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {activeLesson.quiz.question}
                  </h3>

                  <div className="space-y-2">
                    {activeLesson.quiz.options.map((opt, idx) => {
                      const isSelected = selectedQuizAnswer === idx;
                      const isCorrect = idx === activeLesson.quiz?.correctIndex;

                      let btnStyle = 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10';
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                        else if (isSelected) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-[#7C5CFF]/20 border-[#7C5CFF] text-white';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedQuizAnswer(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      disabled={selectedQuizAnswer === null}
                      onClick={() => {
                        setQuizSubmitted(true);
                        handleCompleteLesson(activeLesson.id);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#7C5CFF] text-white text-xs font-bold hover:bg-[#7C5CFF]/90 transition-all disabled:opacity-40"
                    >
                      Confirmar Respuesta
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                      <strong>Fundamento:</strong> {activeLesson.quiz.explanation}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                <button
                  onClick={() => handleCompleteLesson(activeLesson.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/30 transition-all"
                >
                  <CheckCircle2 size={16} /> Marcar como completada
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Modules & Lessons Navigation */}
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Estructura del Programa
              </h3>

              {activeCourse.modules?.map((mod) => (
                <div key={mod.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400">{mod.title}</h4>
                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCurrent = activeLesson.id === les.id;
                      const isDone = completedLessons.includes(les.id);

                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setActiveLesson(les);
                            setSelectedQuizAnswer(null);
                            setQuizSubmitted(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl text-xs flex items-center justify-between transition-all ${
                            isCurrent
                              ? 'bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 text-white font-bold'
                              : 'hover:bg-white/5 text-slate-300'
                          }`}
                        >
                          <span className="truncate">{les.title}</span>
                          {isDone ? (
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Play size={12} className="text-slate-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Socratic AI Tutor Modal Drawer */}
        {tutorOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-[#0B0F17] border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#7C5CFF]/20 text-[#22D3EE] flex items-center justify-center">
                      <Bot size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Tutor Socrático IA</h3>
                      <p className="text-[10px] text-slate-400">Safeness Neural Pedagogic Engine</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTutorOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="h-[65vh] overflow-y-auto py-4 space-y-3 scrollbar-thin">
                  {tutorMessages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
                        m.role === 'user'
                          ? 'ml-auto bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 text-white'
                          : 'bg-white/5 border border-white/8 text-slate-200'
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                  {tutorLoading && (
                    <div className="p-3 rounded-xl bg-white/5 text-xs text-slate-400 animate-pulse">
                      El tutor está formulando una pregunta reflexiva...
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSendTutorMessage} className="flex gap-2 pt-3 border-t border-white/8">
                <input
                  type="text"
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  placeholder="Pregúntale al tutor sobre esta lección..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#7C5CFF]"
                />
                <button
                  type="submit"
                  disabled={tutorLoading || !tutorInput.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-bold disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Course Grid (Catalog & Enrolled)
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
          Academia y Formación
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Mis Cursos y Programas Activos
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mt-1">
          Accede a tus lecciones guiadas, módulos interactivos y evaluaciones formativas con apoyo de tutoría socrática.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="glass-panel rounded-3xl border border-white/8 overflow-hidden hover:border-[#7C5CFF]/40 transition-all flex flex-col justify-between group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0B0F17]/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#22D3EE] border border-white/10">
                {course.category}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1 font-bold">
                  <Star size={13} className="fill-amber-300 text-amber-300" /> {course.rating}
                </span>
                <span className="text-slate-300 font-mono">{course.durationHours} horas</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-[#22D3EE] transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {course.shortDescription || course.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={course.coachPhoto} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">{course.coachName}</span>
                </div>

                <button
                  onClick={() => handleOpenCourse(course)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Play size={12} /> Continuar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
