import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  label: string;
  initialTime?: number;
  countDown?: boolean;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function Timer({ 
  label, 
  initialTime = 0, 
  countDown = false,
  onComplete,
  autoStart = false
}: Props) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playSound = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,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');
    audio.play();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = countDown ? prevTime - 1000 : prevTime + 1000;
          
          if (countDown && newTime <= 0) {
            setIsRunning(false);
            playSound();
            if (onComplete) onComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, countDown, onComplete, playSound]);

  const handleReset = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-purple-500/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-purple-300 font-medium">{label}</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className={`p-2 rounded-full ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <div className="text-2xl font-bold text-purple-200 tabular-nums">
        {formatTime(time)}
      </div>
    </div>
  );
}