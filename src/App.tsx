import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { ExerciseForm } from './components/ExerciseForm';
import { ExerciseList } from './components/ExerciseList';
import { RouletteWheel } from './components/RouletteWheel';
import { ExerciseLog } from './components/ExerciseLog';
import { TagFilter } from './components/Tagfilter';
import { Achievements } from './components/Achievements';
import { getAllExercises, addExercise, deleteExercise } from './db';
import type { Exercise, NewExercise, Difficulty, ExerciseLog as ExerciseLogType, MeasureType, Achievement } from './types';

const DIFFICULTY_RANGES = {
  reps: {
    extreme: { min: 10, max: 25 },
    difficile: { min: 7, max: 15 },
    moyen: { min: 6, max: 9 },
    facile: { min: 5, max: 8 },
    primaire: { min: 3, max: 5 },
    nouveau: { min: 3, max: 3 }
  },
  time: {
    extreme: { min: 60, max: 120 },
    difficile: { min: 45, max: 90 },
    moyen: { min: 30, max: 60 },
    facile: { min: 20, max: 45 },
    primaire: { min: 15, max: 30 },
    nouveau: { min: 15, max: 15 }
  }
} as const;

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    title: 'Premier pas',
    description: 'Complétez votre premier exercice',
    icon: '🎯',
    requirement: 1,
    currentProgress: 0,
    category: 'reps'
  },
  {
    id: 'variety-master',
    title: 'Maître de la variété',
    description: 'Essayez 10 exercices différents',
    icon: '🎨',
    requirement: 10,
    currentProgress: 0,
    category: 'variety'
  },
  {
    id: 'endurance-king',
    title: 'Roi de l\'endurance',
    description: 'Accumulez 1000 répétitions',
    icon: '👑',
    requirement: 1000,
    currentProgress: 0,
    category: 'reps'
  }
];

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [excludedTags, setExcludedTags] = useState<string[]>([]);
  const [logs, setLogs] = useState<ExerciseLogType[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const loadedExercises = await getAllExercises();
        setExercises(loadedExercises);
        const tags = Array.from(new Set(loadedExercises.map(ex => ex.tag)));
        setExistingTags(tags);
      } catch (error) {
        console.error('Erreur lors du chargement des exercices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, []);

  const handleAddExercise = async (newExercise: NewExercise) => {
    const exercise = { ...newExercise, id: nanoid() };
    try {
      await addExercise(exercise);
      setExercises(prev => [...prev, exercise]);
      if (!existingTags.includes(exercise.tag)) {
        setExistingTags(prev => [...prev, exercise.tag]);
      }
    } catch (error) {
      console.error(`Erreur lors de l'ajout de l'exercice:`, error);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await deleteExercise(id);
      setExercises(prev => prev.filter(exercise => exercise.id !== id));
      const remainingExercises = exercises.filter(ex => ex.id !== id);
      const remainingTags = Array.from(new Set(remainingExercises.map(ex => ex.tag)));
      setExistingTags(remainingTags);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'exercice:`, error);
    }
  };

  const getRandomAmount = (difficulty: Difficulty, measureType: MeasureType) => {
    const { min, max } = DIFFICULTY_RANGES[measureType][difficulty];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSelectedTag = !selectedTag || exercise.tag.trim().toLowerCase() === selectedTag.trim().toLowerCase();
    const isNotExcluded = !excludedTags.includes(exercise.tag);
    return matchesSelectedTag && isNotExcluded;
  });

  const handleSpin = useCallback(() => {
    if (filteredExercises.length === 0 || isSpinning) {
      console.warn('Aucun exercice filtré disponible pour tourner la roue.');
      return;
    }

    setIsSpinning(true);
    setSelectedExercise(null);
    setAmount(null);

    setTimeout(() => {
      const randomExercise = filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
      const randomAmount = getRandomAmount(randomExercise.difficulty, randomExercise.measureType);

      setSelectedExercise(randomExercise);
      setAmount(randomAmount);
      setIsSpinning(false);
    }, 2000);
  }, [filteredExercises, isSpinning]);

  const handleCompleteExercise = () => {
    if (!selectedExercise || amount === null) return;

    setLogs(prevLogs => {
      const existingLog = prevLogs.find(log => log.exerciseId === selectedExercise.id);
      
      if (existingLog) {
        return prevLogs.map(log => 
          log.exerciseId === selectedExercise.id
            ? { ...log, totalAmount: log.totalAmount + amount, count: log.count + 1 }
            : log
        );
      }

      return [...prevLogs, {
        exerciseId: selectedExercise.id,
        name: selectedExercise.name,
        totalAmount: amount,
        measureType: selectedExercise.measureType,
        count: 1,
        timestamp: Date.now()
      }];
    });

    handleSpin();
  };

  const handleSkipExercise = () => {
    handleSpin();
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-purple-300 text-lg">
          Chargement des exercices...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-300 mb-3 tracking-tight">
            Workout Roulette
          </h1>
          <p className="text-purple-200/80 text-lg max-w-2xl mx-auto">
            Tournez la roue et effectuez les exercices, puis recommencez !
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Main workout section */}
          <div className="lg:order-2 space-y-6">
            <div className="sticky top-6">
              <RouletteWheel
                selectedExercise={selectedExercise}
                filteredExercises={filteredExercises}
                amount={amount}
                isSpinning={isSpinning}
                onSpin={handleSpin}
                onComplete={handleCompleteExercise}
                onSkip={handleSkipExercise}
              />
              <div className="mt-6">
                <TagFilter
                  existingTags={existingTags}
                  selectedTag={selectedTag}
                  excludedTags={excludedTags}
                  onSelectTag={setSelectedTag}
                  onToggleExcludeTag={(tag) => {
                    setExcludedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="lg:order-1 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur supports-[backdrop-filter]:bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-purple-300 mb-6">
                Gérer vos exercices
              </h2>
              <div className="space-y-6">
                <ExerciseForm onAdd={handleAddExercise} existingTags={existingTags} />
                <ExerciseLog logs={logs} onClearLogs={handleClearLogs} />
                <Achievements achievements={achievements} />
              </div>
            </div>
          </div>
        </div>

        {/* Exercise list section */}
        <section className="rounded-xl bg-gray-800/50 backdrop-blur supports-[backdrop-filter]:bg-gray-800/50 p-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">
            Liste des exercices
          </h2>
          <ExerciseList exercises={exercises} onDelete={handleDeleteExercise} />
        </section>
      </div>
    </div>
  );
}

export default App;