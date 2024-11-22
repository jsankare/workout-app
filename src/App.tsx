import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { ExerciseForm } from './components/ExerciseForm';
import { ExerciseList } from './components/ExerciseList';
import { RouletteWheel } from './components/RouletteWheel';
import { ExerciseLog } from './components/ExerciseLog';
import { TagFilter } from './components/Tagfilter';
import { getAllExercises, addExercise, deleteExercise } from './db';
import type { Exercise, NewExercise, Difficulty, ExerciseLog as ExerciseLogType, MeasureType } from './types';

const SPIN_DURATION = 2000;

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
    }, SPIN_DURATION);
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
        count: 1
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
        <div className="text-purple-300">Chargement des exercices ..</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-300 mb-2">Workout Roulette</h1>
        <p className="text-purple-200 opacity-75">Tournez la roue et effectuez les exercices, puis recommencez !</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ExerciseForm onAdd={handleAddExercise} existingTags={existingTags} />
          <ExerciseLog logs={logs} onClearLogs={handleClearLogs} />
        </div>

        <div className="space-y-8">
          <RouletteWheel
            selectedExercise={selectedExercise}
            filteredExercises={filteredExercises}
            amount={amount}
            isSpinning={isSpinning}
            onSpin={handleSpin}
            onComplete={handleCompleteExercise}
            onSkip={handleSkipExercise}
          />

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

      <div className="mt-12">
        <ExerciseList exercises={exercises} onDelete={handleDeleteExercise} />
      </div>
    </div>
  );
}

export default App;