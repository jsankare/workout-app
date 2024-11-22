import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Exercise } from "../types";

interface Props {
  exercises: Exercise[];
  onDelete: (id: string) => void;
}

const DIFFICULTY_RANGES = {
  reps: {
    extreme: "10-25 reps",
    difficile: "7-15 reps",
    moyen: "6-9 reps",
    facile: "5-8 reps",
    primaire: "3-5 reps",
    nouveau: "3 reps",
  },
  time: {
    extreme: "60-120 sec",
    difficile: "45-90 sec",
    moyen: "30-60 sec",
    facile: "20-45 sec",
    primaire: "15-30 sec",
    nouveau: "15 sec",
  }
} as const;

export function ExerciseList({ exercises, onDelete }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const uniqueTags = Array.from(new Set(exercises.map((exercise) => exercise.tag)));
  const filteredExercises = selectedTag
    ? exercises.filter((exercise) => exercise.tag === selectedTag)
    : exercises;

  if (exercises.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg border-2 border-dashed border-purple-500/30">
        <p className="text-purple-300">
          Aucun exercice pour le moment, ajoutez-en et tournez la roue !
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <p className="text-purple-300">Voir certains exercices uniquement</p>
        <select
          className="px-4 py-2 bg-gray-800 text-purple-300 border border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-400"
          value={selectedTag || ""}
          onChange={(e) => setSelectedTag(e.target.value || null)}
        >
          <option value="">Tous les tags</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {selectedTag && (
          <button
            onClick={() => setSelectedTag(null)}
            className="px-4 py-2 text-sm text-purple-200 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {filteredExercises.length === 0 ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg border-2 border-dashed border-purple-500/30">
          <p className="text-purple-300">
            Aucun exercice trouvé pour le tag sélectionné.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-gray-800 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-purple-200">{exercise.name}</h3>
                  <p className="text-sm text-purple-400 italic">Tag : {exercise.tag}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-sm px-2 py-0.5 rounded-full ${
                        exercise.difficulty === "facile"
                          ? "bg-green-900/50 text-green-300"
                          : exercise.difficulty === "moyen"
                          ? "bg-yellow-900/50 text-yellow-300"
                          : exercise.difficulty === "difficile"
                          ? "bg-orange-900/50 text-orange-300"
                          : exercise.difficulty === "extreme"
                          ? "bg-red-900/50 text-red-300"
                          : exercise.difficulty === "primaire"
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-gray-900/50 text-gray-300"
                      }`}
                    >
                      {exercise.difficulty.charAt(0).toUpperCase() +
                        exercise.difficulty.slice(1)}
                    </span>
                    <span className="text-sm text-purple-400">
                      {DIFFICULTY_RANGES[exercise.measureType || 'reps'][exercise.difficulty]}
                    </span>
                    <span className="text-xs text-purple-400">
                      ({(exercise.measureType || 'reps') === 'reps' ? 'Répétitions' : 'Temps'})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(exercise.id)}
                  className="text-purple-400 hover:text-red-400 transition-colors p-2"
                  aria-label="Delete exercise"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}