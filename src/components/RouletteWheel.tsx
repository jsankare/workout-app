import { Dumbbell } from 'lucide-react';
import type { Exercise } from '../types';
import { Timer } from './Timer';

interface Props {
  selectedExercise: Exercise | null;
  amount: number | null;
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
    default: return 'from-purple-500 to-purple-700';
  }
};

export function RouletteWheel({ 
  selectedExercise, 
  amount, 
  isSpinning, 
  onSpin, 
  onComplete,
  onSkip,
  filteredExercises 
}: Props) {
  const gradientColors = selectedExercise 
    ? getDifficultyColor(selectedExercise.difficulty)
    : 'from-purple-500 to-purple-700';

  return (
    <div className="bg-gray-800/50 backdrop-blur supports-[backdrop-filter]:bg-gray-800/50 p-8 rounded-xl shadow-xl border border-purple-500/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Timer label="Durée totale" />
        {selectedExercise?.measureType === 'time' && amount && (
          <Timer
            label="Temps restant"
            initialTime={amount * 1000}
            countDown
            onComplete={onComplete}
            autoStart
          />
        )}
      </div>

      <div className="relative">
        <div
          className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center shadow-lg transform ${
            isSpinning ? 'animate-spin' : ''
          }`}
        >
          <div className="w-56 h-56 rounded-full bg-gray-800/90 backdrop-blur flex items-center justify-center p-6 border-4 border-purple-500/20">
            {selectedExercise ? (
              <div className="space-y-3 text-center">
                <h2 className="text-xl font-bold text-purple-200">{selectedExercise.name}</h2>
                <p className="text-3xl font-bold text-purple-300">
                  {amount} {selectedExercise.measureType === 'reps' ? 'reps' : 'sec'}
                </p>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {selectedExercise.tag}
                </span>
                <p className={`text-sm font-medium capitalize
                  ${selectedExercise.difficulty === 'facile' ? 'text-green-400' : ''}
                  ${selectedExercise.difficulty === 'moyen' ? 'text-yellow-400' : ''}
                  ${selectedExercise.difficulty === 'difficile' ? 'text-orange-400' : ''}
                  ${selectedExercise.difficulty === 'extreme' ? 'text-red-400' : ''}
                  ${selectedExercise.difficulty === 'primaire' ? 'text-blue-400' : ''}
                  ${selectedExercise.difficulty === 'nouveau' ? 'text-gray-400' : ''}
                `}>
                  {selectedExercise.difficulty}
                </p>
              </div>
            ) : (
              <Dumbbell size={48} className="text-purple-400" />
            )}
          </div>
        </div>

        {selectedExercise ? (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Terminé
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Passer
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSpin(filteredExercises)}
            disabled={isSpinning}
            className={`
              absolute left-1/2 -bottom-6 transform -translate-x-1/2
              px-8 py-4 text-lg font-semibold rounded-full
              ${
                isSpinning
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800'
              }
              transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5
            `}
          >
            {isSpinning ? 'Preparez-vous ..' : `C'est parti !`}
          </button>
        )}
      </div>
    </div>
  );
}