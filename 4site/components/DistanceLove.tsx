import React, { useState } from 'react';
import { Mail, Plane, MapPin, Clock, Star, Gift } from 'lucide-react';
import { generateDistanceNote } from '../services/geminiService';

const DistanceLove: React.FC = () => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const buttons = [
    { id: 1, icon: <Plane />, label: "Когда скучаешь", prompt: "сообщение когда сильно скучаешь" },
    { id: 2, icon: <MapPin />, label: "Про расстояние", prompt: "про километры между нами" },
    { id: 3, icon: <Clock />, label: "Когда ждешь встречи", prompt: "про ожидание встречи" },
    { id: 4, icon: <Star />, label: "Перед сном", prompt: "пожелание спокойной ночи на расстоянии" },
  ];

  const handleOpenNote = async (prompt: string) => {
    setLoading(true);
    setActiveNote(null);
    const text = await generateDistanceNote(prompt);
    setActiveNote(text);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 relative z-10 mt-12">
      <h3 className="text-3xl font-script text-center text-valentine-100 mb-8 drop-shadow">
        Наши письма сквозь километры
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleOpenNote(btn.prompt)}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-valentine-400/50 transition-all duration-300"
          >
            <div className="p-3 rounded-full bg-valentine-900/40 text-valentine-300 group-hover:text-white group-hover:bg-valentine-500 transition-colors">
              {React.cloneElement(btn.icon as React.ReactElement<any>, { size: 24 })}
            </div>
            <span className="text-xs md:text-sm font-sans text-valentine-100 font-medium uppercase tracking-wider text-center">
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Note Display Area */}
      <div className={`transition-all duration-500 ease-in-out transform ${activeNote || loading ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#fffcf5] text-valentine-900 p-8 rounded-sm shadow-2xl max-w-lg mx-auto relative rotate-1">
             {/* Envelope styling */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-red-400 to-blue-400 opacity-50"></div>
             
             {loading ? (
                 <div className="flex justify-center py-4">
                     <span className="animate-pulse text-valentine-400 font-serif">Письмо летит к тебе...</span>
                 </div>
             ) : (
                 <>
                    <p className="font-script text-2xl md:text-3xl leading-relaxed mb-4">
                        " {activeNote} "
                    </p>
                    <div className="flex justify-between items-end border-t border-valentine-200 pt-4 mt-4">
                        <Gift className="w-5 h-5 text-valentine-400" />
                        <span className="font-serif italic text-sm text-valentine-600">Всегда рядом</span>
                    </div>
                 </>
             )}
        </div>
      </div>
    </div>
  );
};

export default DistanceLove;