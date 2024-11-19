import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { NewExercise, Difficulty } from '../types';

interface Props {
  onAdd: (exercise: NewExercise) => void;
}

const DIFFICULTY_RANGES = {
  extreme: '10-25 reps',
  difficile: '7-15 reps',
  moyen: '6-9 reps',
  facile: '5-8 reps',
  primaire: '3-5 reps',
  nouveau: '3 reps',
};

export function ExerciseForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('moyen');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedTag) return;

    onAdd({ name, tag: selectedTag, difficulty });
    setName('');
    setSelectedTag('');
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags((prevTags) => [...prevTags, tagInput]);
      setTagInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom de l'exercice
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pompes, abdos, etc .."
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700">
          Ajouter un tag
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Fesses, Bras"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
          Sélectionner un tag
        </label>
        <select
          id="tag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Choisir un tag --</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niveau de difficulté
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(['nouveau', 'primaire', 'facile', 'moyen', 'difficile', 'extreme'] as const).map((level) => (
            <label
              key={level}
              className={`
                flex items-center justify-center p-3 rounded-lg cursor-pointer
                border-2 transition-all
                ${
                  difficulty === level
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
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
                <div className="font-medium capitalize">{level}</div>
                <div className="text-xs text-gray-500">{DIFFICULTY_RANGES[level]}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} />
        Ajouter un exercice
      </button>
    </form>
  );
}
