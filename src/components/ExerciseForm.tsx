import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { NewExercise, Difficulty } from '../types';

interface Props {
  onAdd: (exercise: NewExercise) => void;
  existingTags: string[];
}

const DIFFICULTY_RANGES = {
  extreme: '10-25 reps',
  difficile: '7-15 reps',
  moyen: '6-9 reps',
  facile: '5-8 reps',
  primaire: '3-5 reps',
  nouveau: '3 reps',
} as const;

const DIFFICULTIES: Difficulty[] = ['nouveau', 'primaire', 'facile', 'moyen', 'difficile', 'extreme'];

export function ExerciseForm({ onAdd, existingTags }: Props) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('moyen');
  const [tagInput, setTagInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!selectedTag && !tagInput)) return;

    const finalTag = selectedTag || tagInput;
    onAdd({ name, tag: finalTag, difficulty });
    setName('');
    setTagInput('');
    setSelectedTag('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/20">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-purple-300">
          Nom de l'exercice
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-purple-100 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Pompes, abdos, etc .."
          required
        />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="existingTag" className="block text-sm font-medium text-purple-300 mb-2">
            Sélectionner un tag existant
          </label>
          <select
            id="existingTag"
            value={selectedTag}
            onChange={(e) => {
              setSelectedTag(e.target.value);
              setTagInput('');
            }}
            className="w-full px-3 py-2 bg-gray-700 text-purple-100 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">-- Choisir un tag --</option>
            {existingTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tagInput" className="block text-sm font-medium text-purple-300 mb-2">
            Ou créer un nouveau tag
          </label>
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setSelectedTag('');
            }}
            className="w-full px-3 py-2 bg-gray-700 text-purple-100 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Ex: Fesses, Bras"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-300 mb-2">
          Niveau de difficulté
        </label>
        <div className="grid grid-cols-3 gap-4">
          {DIFFICULTIES.map((level) => (
            <label
              key={level}
              className={`
                flex items-center justify-center p-3 rounded-lg cursor-pointer
                border-2 transition-all
                ${
                  difficulty === level
                    ? 'border-purple-500 bg-purple-900/50 text-purple-300'
                    : 'border-gray-700 hover:border-purple-500/50'
                }
              `}
            >
              <input
                type="radio"
                name="difficulty"
                value={level}
                checked={difficulty === level}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-medium capitalize text-purple-200">{level}</div>
                <div className="text-xs text-purple-400">{DIFFICULTY_RANGES[level]}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
      >
        <Plus size={20} />
        Ajouter un exercice
      </button>
    </form>
  );
}