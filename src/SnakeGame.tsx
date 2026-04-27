import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from './constants';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    onScoreChange(0);
    lastUpdateRef.current = 0;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (gameOver || isPaused) {
      gameLoopRef.current = requestAnimationFrame(update);
      return;
    }

    if (time - lastUpdateRef.current < GAME_SPEED) {
      gameLoopRef.current = requestAnimationFrame(update);
      return;
    }

    lastUpdateRef.current = time;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Collision checks
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food check
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    gameLoopRef.current = requestAnimationFrame(update);
  }, [direction, food, gameOver, generateFood, isPaused, onScoreChange]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(update);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food (Neon Pink)
    ctx.fillStyle = '#FF00FF';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FF00FF';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake (Neon Green)
    snake.forEach((segment, i) => {
      ctx.fillStyle = '#39FF14';
      ctx.shadowBlur = i === 0 ? 10 : 0;
      ctx.shadowColor = '#39FF14';
      ctx.fillRect(segment.x * size + 1, segment.y * size + 1, size - 2, size - 2);
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group overflow-hidden border-2 border-zinc-800 bg-black/40">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="block max-w-full aspect-square"
      />
      
      <AnimatePresence>
        {isPaused && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px]"
          >
            <div className="flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Awaiting Uplink</span>
            </div>
          </motion.div>
        )}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/90 backdrop-blur-md"
          >
            <h2 className="text-3xl font-bold neon-pink uppercase mb-2 tracking-tighter">Connection Lost</h2>
            <p className="text-zinc-500 mb-8 uppercase tracking-[0.3em] text-xs">Score Artifact: {score.toString().padStart(6, '0')}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 border border-neon-pink text-neon-pink font-bold rounded-none hover:bg-neon-pink hover:text-black transition-all uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(255,0,255,0.2)]"
            >
              Re-Establish
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full p-3 flex justify-between text-[10px] text-zinc-700 uppercase font-mono pointer-events-none">
        <span>Grid: {GRID_SIZE}x{GRID_SIZE}</span>
        <span>Lat: 12ms</span>
      </div>
    </div>
  );
};

export default SnakeGame;
