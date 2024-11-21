import { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { ExerciseForm } from './components/ExerciseForm';
import { ExerciseList } from './components/ExerciseList';
import { RouletteWheel } from './components/RouletteWheel';
import { ExerciseLog } from './components/ExerciseLog';
import { getAllExercises, addExercise, deleteExercise } from './db';
import type { Exercise, NewExercise, Difficulty, ExerciseLog as ExerciseLogType } from './types';

const SPIN_DURATION = 2000;

const DIFFICULTY_RANGES = {
  extreme: { min: 10, max: 25 },
  difficile: { min: 7, max: 15 },
  moyen: { min: 6, max: 9 },
  facile: { min: 5, max: 8 },
  primaire: { min: 3, max: 5 },
  nouveau: { min: 3, max: 3 }
} as const;

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [reps, setReps] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [logs, setLogs] = useState<ExerciseLogType[]>([]);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const loadedExercises = await getAllExercises();
        setExercises(loadedExercises);
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
    } catch (error) {
      console.error(`Erreur lors de l'ajout de l'exercice:`, error);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await deleteExercise(id);
      setExercises(prev => prev.filter(exercise => exercise.id !== id));
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'exercice:`, error);
    }
  };

  const getRandomReps = (difficulty: Difficulty) => {
    const { min, max } = DIFFICULTY_RANGES[difficulty];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const filteredExercises = exercises.filter(
    exercise =>
      exercise.tag && (!selectedTag || exercise.tag.trim().toLowerCase() === selectedTag.trim().toLowerCase())
  );

  const handleSpin = useCallback(() => {
    if (filteredExercises.length === 0 || isSpinning) {
      console.warn('Aucun exercice filtré disponible pour tourner la roue.');
      return;
    }

    setIsSpinning(true);
    setSelectedExercise(null);
    setReps(null);

    setTimeout(() => {
      const randomExercise =
        filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
      const randomReps = getRandomReps(randomExercise.difficulty);

      setSelectedExercise(randomExercise);
      setReps(randomReps);
      setIsSpinning(false);
    }, SPIN_DURATION);
  }, [filteredExercises, isSpinning]);

  const handleCompleteExercise = () => {
    if (!selectedExercise || reps === null) return;

    setLogs(prevLogs => {
      const existingLog = prevLogs.find(log => log.exerciseId === selectedExercise.id);
      
      if (existingLog) {
        return prevLogs.map(log => 
          log.exerciseId === selectedExercise.id
            ? {
                ...log,
                totalReps: log.totalReps + reps,
                count: log.count + 1
              }
            : log
        );
      }

      return [...prevLogs, {
        exerciseId: selectedExercise.id,
        name: selectedExercise.name,
        totalReps: reps,
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

  const uniqueTags = Array.from(new Set(exercises.map(ex => ex.tag)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement des exercices ..</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Workout Roulette</h1>
        <p className="text-gray-600">Tournez la roue et effectuez les exercices, puis recommencez !</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <label htmlFor="tagFilter" className="block text-gray-700 font-medium">
            Filtrer par tag :
          </label>
          <select
            id="tagFilter"
            value={selectedTag || ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="mt-2 p-2 border rounded w-full"
          >
            <option key="all" value="">Tous les exercices</option>
            {uniqueTags.map(tag => (
              <option key={`filter-${tag}`} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ExerciseForm onAdd={handleAddExercise} />
            <ExerciseLog logs={logs} onClearLogs={handleClearLogs} />
          </div>

          <div className="space-y-6">
            <RouletteWheel
              selectedExercise={selectedExercise}
              filteredExercises={filteredExercises}
              reps={reps}
              isSpinning={isSpinning}
              onSpin={handleSpin}
              onComplete={handleCompleteExercise}
              onSkip={handleSkipExercise}
            />
          </div>
        </div>

        <ExerciseList exercises={exercises} onDelete={handleDeleteExercise} />
      </div>
    </div>
  );
}

export default App;