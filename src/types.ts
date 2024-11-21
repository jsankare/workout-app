export type Difficulty = 'nouveau'|'primaire'|'facile'|'moyen'|'difficile'|'extreme';

export interface Exercise {
  id: string;
  name: string;
  tag: string;
  difficulty: Difficulty;
}

export interface NewExercise {
  name: string;
  tag: string;
  difficulty: Difficulty;
}

export interface ExerciseLog {
  exerciseId: string;
  name: string;
  totalReps: number;
  count: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  currentProgress: number;
  category: 'reps' | 'variety' | 'time' | 'streak' | 'difficulty';
  unlockedAt?: number;
}

export interface WorkoutStats {
  totalReps: number;
  totalTime: number;
  uniqueExercises: Set<string>;
  lastWorkout?: number;
  currentStreak: number;
  longestStreak: number;
  workoutDays: Set<string>;
  difficultyCount: Record<Difficulty, number>;
}