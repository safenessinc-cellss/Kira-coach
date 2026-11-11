import React, { useState, useEffect } from 'react';
import { X, Heart, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { CoachStory } from '../types';

interface StoryViewerModalProps {
  stories: CoachStory[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function StoryViewerModal({ stories, initialIndex = 0, isOpen, onClose }: StoryViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      setLiked(false);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen || !currentStory) return;

    setProgress(0);
    const interval = 50; // update every 50ms
    const totalDuration = 5000; // 5 seconds per story
    const increment = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, stories.length, onClose, currentStory]);

  if (!isOpen || !currentStory) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alert(`Mensaje enviado a ${currentStory.coachName}: "${replyText}"`);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Navigation arrows for desktop */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all z-20"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-all z-20"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Main Story Container (Instagram 9:16 mobile aspect) */}
      <div className="relative w-full max-w-[420px] h-[85vh] max-h-[780px] rounded-[36px] overflow-hidden bg-slate-950 border border-white/15 shadow-2xl flex flex-col justify-between">
        {/* Story Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Top Header */}
        <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.coachPhoto}
              alt=""
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#7C5CFF]"
            />
            <div>
              <p className="text-xs font-bold leading-tight drop-shadow">{currentStory.coachName}</p>
              <p className="text-[10px] text-slate-300 font-mono drop-shadow">{currentStory.createdAt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Background Image / Media */}
        <div className="absolute inset-0 z-10" onClick={handleNext}>
          <img
            src={currentStory.mediaUrl}
            alt=""
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Story Bottom Caption & Reply Bar */}
        <div className="relative z-30 p-4 space-y-3 mt-auto">
          {currentStory.caption && (
            <div className="p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white leading-relaxed">
              {currentStory.caption}
            </div>
          )}

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Responder a ${currentStory.coachName.split(' ')[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white placeholder-slate-300 focus:outline-none focus:border-white"
            />
            <button
              type="button"
              onClick={() => setLiked(!liked)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                liked ? 'bg-rose-500/80 border-rose-400 text-white scale-110' : 'bg-black/60 border-white/20 text-white hover:text-rose-400'
              }`}
            >
              <Heart size={18} className={liked ? 'fill-current' : ''} />
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-white text-slate-950 font-bold disabled:opacity-40 transition-opacity"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
