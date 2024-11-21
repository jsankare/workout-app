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