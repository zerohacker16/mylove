import React, { useState } from 'react';
import { generateBeautyWord } from '../services/geminiService';
import { Star, Wand2 } from 'lucide-react';
import { BeautyCompliment } from '../types';

interface Props {
    onAction: () => void;
}

const BeautyWords: React.FC<Props> = ({ onAction }) => {
  const [data, setData] = useState<BeautyCompliment | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    onAction(); // Trigger effects
    const result = await generateBeautyWord();
    setData(result);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 relative z-10 my-20">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-serif text-valentine-100 mb-2">1000 Слов о Тебе</h3>
        <p className="text-valentine-300/80 text-sm">Узнай, какая ты сегодня...</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-4 bg-white text-valentine-900 rounded-full font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,77,109,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
            {loading ? <Wand2 className="animate-spin" /> : <Star className="fill-valentine-500 text-valentine-500" />}
            <span>{loading ? "Ищем слово..." : "Скажи мне"}</span>
        </button>

        {/* Display Area */}
        {data && !loading && (
            <div className="animate-fade-in-up text-center space-y-4 bg-valentine-900/40 backdrop-blur-md p-8 rounded-2xl border border-valentine-500/30 w-full">
                <h2 className="text-4xl md:text-6xl font-script text-transparent bg-clip-text bg-gradient-to-r from-valentine-200 to-white drop-shadow-sm">
                    {data.word}
                </h2>
                <div className="h-px w-20 bg-valentine-400/50 mx-auto"></div>
                <p className="text-xl text-valentine-100 font-serif italic leading-relaxed">
                    "{data.description}"
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default BeautyWords;