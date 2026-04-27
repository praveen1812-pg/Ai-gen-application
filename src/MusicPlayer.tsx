import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Track } from './constants';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  progress: number;
  onTimeUpdate: (currentTime: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  progress,
  onTimeUpdate,
  audioRef,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-24 border-t border-[#1a1a1a] bg-[#0a0a0a] flex items-center px-10 gap-12 w-full mt-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        onEnded={onNext}
      />
      
      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onPrev}
          className="text-zinc-400 cursor-pointer hover:neon-blue transition-colors"
        >
          <SkipBack size={18} fill="currentColor" />
        </button>
        <button 
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-full border border-neon-blue flex items-center justify-center cursor-pointer text-xs neon-blue bg-blue-500/10 shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={onNext}
          className="text-zinc-400 cursor-pointer hover:neon-blue transition-colors"
        >
          <SkipForward size={18} fill="currentColor" />
        </button>
      </div>

      {/* Progress & info */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Now Processing</span>
            <span className="text-sm font-bold neon-blue truncate max-w-[200px]">{currentTrack.title.toUpperCase()}</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            {audioRef.current ? formatTime(audioRef.current.currentTime) : "00:00"} / {formatTime(currentTrack.duration)}
          </span>
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-blue shadow-[0_0_10px_#00F3FF]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
        </div>
      </div>

      {/* Volume (Visual only in theme) */}
      <div className="w-32 flex items-center gap-3">
        <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono"><Volume2 size={12} /></div>
        <div className="flex-1 h-1 bg-zinc-800 rounded-full">
          <div className="h-full bg-zinc-500 w-3/4"></div>
        </div>
      </div>
    </footer>
  );
};

export default MusicPlayer;
