import React, { useRef } from 'react';
import VisualEffects, { VisualEffectsHandle } from './components/VisualEffects';
import MusicPlayer from './components/MusicPlayer';
import ComplimentMachine from './components/ComplimentMachine';
import DistanceLove from './components/DistanceLove';
import BeautyWords from './components/BeautyWords';
import { ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const effectsRef = useRef<VisualEffectsHandle>(null);
  const mainRef = useRef<HTMLElement>(null);

  const handleFirework = () => {
    effectsRef.current?.launchFirework();
  };
  
  const handlePageClick = (e: React.MouseEvent) => {
      // This listener is on the root div.
      // It captures clicks anywhere on the page unless stopPropagation is called.
      // We use pageX/pageY to give absolute coordinates relative to document (since canvas is full height)
      effectsRef.current?.spawnHearts(e.pageX, e.pageY);
  }

  const scrollToMain = () => {
    mainRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-valentine-500 selection:text-white cursor-pointer" onClick={handlePageClick}>
      <VisualEffects ref={effectsRef} />
      <MusicPlayer />

      {/* Intro Screen */}
      <header className="relative h-screen flex flex-col items-center justify-center z-10 px-4 pointer-events-none">
        <div className="text-center space-y-6 animate-fade-in-up">
           <h1 className="font-script text-7xl md:text-[9rem] text-transparent bg-clip-text bg-gradient-to-b from-valentine-200 to-valentine-500 drop-shadow-[0_0_15px_rgba(255,77,109,0.5)] pb-4">
            Я Тебя Люблю
          </h1>
          <p className="text-valentine-100 font-serif text-xl md:text-3xl italic tracking-wide">
             Кликни в любом месте, чтобы подарить сердце
          </p>
        </div>
        
        <div className="absolute bottom-10 animate-bounce cursor-pointer text-white/50 hover:text-white transition-colors pointer-events-auto" onClick={(e) => { e.stopPropagation(); scrollToMain(); }}>
          <ChevronDown size={32} />
        </div>
      </header>

      {/* Main Content: pointer-events-none on wrapper so clicks go through gaps, 
          but pointer-events-auto on children so they are interactive.
          Wait, if we want clicks on "gaps" to trigger hearts, we shouldn't block them.
          If we want clicks on TEXT to trigger hearts, we should allow bubbling.
          The cleanest way: Remove pointer-events restrictions, rely on bubbling. 
      */}
      <main ref={mainRef} className="relative z-10 pb-40 space-y-24">
        
        <section className="min-h-[80vh] flex flex-col justify-center">
            <ComplimentMachine onFireworkRequest={handleFirework} />
        </section>

        <section className="py-10">
            <BeautyWords onAction={handleFirework} />
        </section>

        <section className="bg-black/20 backdrop-blur-sm py-20">
            <DistanceLove />
        </section>

        <footer className="text-center text-valentine-300/40 font-sans text-xs pb-8 pointer-events-none">
            <p>Создано с любовью. Листай вниз, чтобы увидеть сколько сердец я тебе подарил.</p>
        </footer>

      </main>
    </div>
  );
};

export default App;