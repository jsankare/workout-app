import { openDB, DBSchema } from 'idb';
import type { Exercise } from '../types';

interface ExerciseDB extends DBSchema {
  exercises: {
    key: string;
    value: Exercise;
    indexes: { 'by-name': string };
  };
}

const DB_NAME = 'exercise-roulette-db';
const STORE_NAME = 'exercises';

export async function initDB() {
  return openDB<ExerciseDB>(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('by-name', 'name');
    },
  });
}

export async function getAllExercises(): Promise<Exercise[]> {
  const db = await initDB();
  const exercises = await db.getAll(STORE_NAME);
  // Migrate existing exercises to include measureType
  return exercises.map(exercise => ({
    ...exercise,
    measureType: exercise.measureType || 'reps'
  }));
}

export async function addExercise(exercise: Exercise): Promise<void> {
  const db = await initDB();
  await db.add(STORE_NAME, exercise);
}

export async function deleteExercise(id: string): Promise<void> {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}