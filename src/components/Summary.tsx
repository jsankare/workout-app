import type { Exercise } from '../types';

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

export function Summary({ exercices }: Array) {
  const gradientColors = selectedExercise 
    ? getDifficultyColor(selectedExercise.difficulty)
    : 'from-blue-500 to-purple-600';

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  return (
    <div>

    </div>
  );
}