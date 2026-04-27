/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Github } from 'lucide-react';
import SnakeGame from './SnakeGame';
import MusicPlayer from './MusicPlayer';
import { DUMMY_TRACKS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play().catch(console.error), 0);
    }
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play().catch(console.error), 0);
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(console.error), 0);
  };

  const handleTimeUpdate = (currentTime: number) => {
    if (audioRef.current) {
      setProgress((currentTime / audioRef.current.duration) * 100);
    }
  };

  return (
    <div className="flex flex-col h-screen border-4 border-[#1a1a1a] bg-[#050505] text-white selection:bg-neon-blue selection:text-black font-mono overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-[#0a0a0a] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
          <h1 className="text-2xl font-bold tracking-tighter neon-blue uppercase">SYNTH-STRIKE v1.0</h1>
        </div>
        
        <div className="flex gap-12 items-center">
          <div className="text-center">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">High Score</div>
            <div className="text-xl font-bold neon-pink tracking-widest tabular-nums">
              {highScore.toString().padStart(6, '0')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Current Score</div>
            <div className="text-3xl font-bold neon-green tracking-widest leading-none tabular-nums">
              {score.toString().padStart(6, '0')}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-[#1a1a1a] bg-[#080808] p-6 flex flex-col flex-shrink-0">
          <h2 className="text-xs font-bold text-zinc-400 mb-6 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
            <Terminal size={14} /> Audio Uplinks
          </h2>
          
          <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            {DUMMY_TRACKS.map((track, index) => (
              <div 
                key={track.id}
                onClick={() => handleTrackSelect(index)}
                className={`p-3 border transition-colors cursor-pointer rounded flex gap-4 items-center group ${
                  index === currentTrackIndex 
                    ? 'border-neon-green/30 bg-zinc-900/50' 
                    : 'border-zinc-800 hover:border-zinc-600 bg-transparent'
                }`}
              >
                <div className={`w-10 h-10 bg-zinc-800 flex items-center justify-center text-xs ${
                  index === currentTrackIndex ? 'neon-green' : 'text-zinc-600 group-hover:text-zinc-400'
                }`}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${
                    index === currentTrackIndex ? 'neon-green' : 'text-zinc-300 group-hover:text-white'
                  }`}>
                    {track.title.toUpperCase()}.WAV
                  </div>
                  <div className="text-[10px] text-zinc-500 italic truncate italic">{track.artist.toUpperCase()} AI</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 border border-dashed border-zinc-800 rounded bg-zinc-950/50">
            <div className="text-[10px] text-zinc-600 uppercase mb-2">Terminal Output</div>
            <div className="text-[9px] text-green-800/60 leading-relaxed font-mono">
              [SYS] Game Engine: Online<br />
              [SYS] Audio Buffer: Ready<br />
              [SYS] User: {isPlaying ? 'ACTIVE' : 'IDLE'}<br />
              [SYS] Processing...
            </div>
          </div>
        </aside>

        {/* Content Section (Game Area) */}
        <section className="flex-1 bg-[#050505] flex items-center justify-center relative grid-pattern overflow-hidden">
          <SnakeGame onScoreChange={handleScoreChange} isPaused={!isPlaying} />
          
          {/* Controls hint */}
          <div className="absolute bottom-8 right-8 text-right p-4 bg-black/40 border border-zinc-800 backdrop-blur-sm">
            <div className="text-[10px] text-zinc-500 mb-2 tracking-widest uppercase font-bold">Controller Mapping</div>
            <div className="flex gap-2 justify-end">
              {['W', 'A', 'S', 'D'].map(key => (
                <div key={key} className="w-8 h-8 flex items-center justify-center border border-zinc-700 text-zinc-500 text-[10px] hover:border-neon-blue hover:text-neon-blue transition-colors">
                  {key}
                </div>
              ))}
            </div>
            <div className="mt-2 text-[8px] text-zinc-600 uppercase tracking-tighter">Keyboard Navigation Required</div>
          </div>
        </section>
      </main>

      {/* Footer / Music Player */}
      <MusicPlayer 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        progress={progress}
        onTimeUpdate={handleTimeUpdate}
        audioRef={audioRef}
      />

      {/* Retro scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-10" />
    </div>
  );
}

