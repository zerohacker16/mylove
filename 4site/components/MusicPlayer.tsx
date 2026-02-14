import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Using a royalty-free romantic track
  const trackUrl = "/love.mp3"; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Auto-play blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 shadow-xl transition-all hover:bg-black/60">
      <audio ref={audioRef} src={trackUrl} loop />
      
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-valentine-500/20 flex items-center justify-center animate-spin-slow" style={{ animationDuration: '4s' }}>
            <Music className="w-5 h-5 text-valentine-200" />
        </div>
        <div className="hidden md:block text-xs text-white/80 font-sans mr-2">
          <p>моя Шаритулька♥️</p>
          <p className="text-[10px] opacity-70">для тебя♥️</p>
        </div>
      </div>

      <button 
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>

      <div className="flex items-center gap-2 group relative">
        <button onClick={toggleMute} className="text-white/80 hover:text-white">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300">
           <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-valentine-400"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
