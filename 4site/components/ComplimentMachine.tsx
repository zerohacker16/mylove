import React, { useState } from 'react';
import { generateNextCompliment } from '../services/geminiService';
import { Heart, Loader2 } from 'lucide-react';

interface Props {
    onFireworkRequest: () => void;
}

const ComplimentMachine: React.FC<Props> = ({ onFireworkRequest }) => {
  const [compliment, setCompliment] = useState<string>("Нажми на сердце, чтобы узнать, почему я тебя люблю");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (loading) return;
    setLoading(true);
    onFireworkRequest(); // Launch firework on click
    
    const text = await generateNextCompliment(count);
    setCompliment(text);
    setCount(prev => prev + 1);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto text-center relative z-10 min-h-[500px]">
      
      {/* Top Section: Counter & Text */}
      <div className="flex-1 flex flex-col items-center justify-end pb-12 w-full">
        <div className="mb-6 inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/80 text-sm font-sans tracking-wider animate-fade-in-up">
          ПРИЧИНА #{count}
        </div>

        <div className="w-full min-h-[160px] flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-3xl p-6 border border-white/5 shadow-xl">
           <h2 className="text-xl md:text-3xl font-serif text-white leading-relaxed drop-shadow-lg transition-all duration-500">
             {loading ? <Loader2 className="animate-spin w-8 h-8 mx-auto opacity-50" /> : `"${compliment}"`}
           </h2>
        </div>
      </div>

      {/* Bottom Section: Button */}
      <div className="pb-8">
        <button
          onClick={handleNext}
          disabled={loading}
          className="group relative"
        >
          {/* Glowing ring */}
          <div className="absolute inset-0 bg-valentine-500 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
          
          {/* Main Button */}
          <div className="relative bg-gradient-to-r from-valentine-500 to-valentine-700 text-white w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-active:scale-95 transition-all duration-300 border-4 border-valentine-300/30">
            <Heart className={`w-12 h-12 fill-white ${loading ? 'animate-ping' : ''}`} />
          </div>
        </button>
        
        <p className="mt-6 text-valentine-200/60 text-sm font-sans">
          (Кликни, чтобы увидеть магию)
        </p>
      </div>
    </div>
  );
};

export default ComplimentMachine;