import { Dumbbell } from 'lucide-react';
import type { Exercise } from '../types';
import { useState, useEffect } from 'react';

interface Props {
  selectedExercise: Exercise | null;
  reps: number | null;
  isSpinning: boolean;
  onSpin: (filteredExercises: Exercise[]) => void;
  onComplete: () => void;
  onSkip: () => void;
  filteredExercises: Exercise[];
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'facile': return 'from-green-500 to-emerald-600';
    case 'moyen': return 'from-yellow-500 to-orange-600';
    case 'difficile': return 'from-orange-500 to-red-600';
    case 'extreme': return 'from-red-500 to-rose-600';
    case 'primaire': return 'from-blue-500 to-indigo-600';
    case 'nouveau': return 'from-gray-400 to-gray-500';
    default: return 'from-gray-500 to-gray-700';
  }
};

export function RouletteWheel({ 
  selectedExercise, 
  reps, 
  isSpinning, 
  onSpin, 
  onComplete,
  onSkip,
  filteredExercises 
}: Props) {
  const gradientColors = selectedExercise 
    ? getDifficultyColor(selectedExercise.difficulty)
    : 'from-blue-500 to-purple-600';

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (timer) {
      clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setTime(0);
  };

  const formatTime = (milliseconds: number) => {
    const mins = Math.floor(milliseconds / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <p className="text-lg font-bold text-gray-700">Temps : {formatTime(time)}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleStartStop}
            className={`px-8 py-4 text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${
              isRunning
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isRunning ? 'Stop' : 'Go !'}
          </button>
          {!isRunning && time > 0 && (
            <button
              onClick={handleReset}
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div
        className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center shadow-lg ${
          isSpinning ? 'animate-spin' : ''
        }`}
      >
        <div className="w-56 h-56 rounded-full bg-white flex items-center justify-center p-6">
          {selectedExercise ? (
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">{selectedExercise.name}</h2>
              <p className="text-3xl font-bold text-blue-600">{reps} reps</p>
              <p className="text-sm text-gray-500 italic">{selectedExercise.tag}</p>
              <p className={`text-sm font-medium capitalize
                ${selectedExercise.difficulty === 'facile' ? 'text-green-600' : ''}
                ${selectedExercise.difficulty === 'moyen' ? 'text-yellow-600' : ''}
                ${selectedExercise.difficulty === 'difficile' ? 'text-orange-600' : ''}
                ${selectedExercise.difficulty === 'extreme' ? 'text-red-600' : ''}
                ${selectedExercise.difficulty === 'primaire' ? 'text-blue-600' : ''}
                ${selectedExercise.difficulty === 'nouveau' ? 'text-gray-600' : ''}
              `}>
                {selectedExercise.difficulty}
              </p>
            </div>
          ) : (
            <Dumbbell size={48} className="text-gray-400" />
          )}
        </div>
      </div>

      {selectedExercise ? (
        <div className="flex justify-center gap-4">
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Terminé
          </button>
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Passer
          </button>
        </div>
      ) : (
        <button
          onClick={() => onSpin(filteredExercises)}
          disabled={isSpinning}
          className={`
            px-8 py-4 text-lg font-semibold rounded-full
            ${
              isSpinning
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            }
            transition-all duration-300 shadow-md hover:shadow-lg
          `}
        >
          {isSpinning ? 'Preparez-vous ..' : `C'est parti !`}
        </button>
      )}
    </div>
  );
}