import { useState } from "react"; 
import { Trash2 } from "lucide-react";
import type { Exercise } from "../types";

interface Props {
  exercises: Exercise[];
  onDelete: (id: string) => void;
}

const DIFFICULTY_RANGES = {
  extreme: "10-25 reps",
  difficile: "7-15 reps",
  moyen: "6-9 reps",
  facile: "5-8 reps",
  primaire: "3-5 reps",
  nouveau: "3 reps",
} as const;

export function ExerciseList({ exercises, onDelete }: Props) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const uniqueTags = Array.from(new Set(exercises.map((exercise) => exercise.tag)));
  const filteredExercises = selectedTag
    ? exercises.filter((exercise) => exercise.tag === selectedTag)
    : exercises;

  if (exercises.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">
          Aucun exercice pour le moment, ajoutez-en et tournez la roue !
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <p>Voir certains exercices uniquement</p>
        <select
          className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:ring focus:ring-blue-300"
          value={selectedTag || ""}
          onChange={(e) => setSelectedTag(e.target.value || null)}
        >
          <option key="all" value="">Tous les tags</option>
          {uniqueTags.map((tag) => (
            <option key={`tag-${tag}`} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {selectedTag && (
          <button
            onClick={() => setSelectedTag(null)}
            className="px-4 py-2 text-sm text-white bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {filteredExercises.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            Aucun exercice trouvé pour le tag sélectionné.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                <p className="text-sm text-gray-500 italic">Tag : {exercise.tag}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm px-2 py-0.5 rounded-full ${
                      exercise.difficulty === "facile"
                        ? "bg-green-100 text-green-700"
                        : exercise.difficulty === "moyen"
                        ? "bg-yellow-100 text-yellow-700"
                        : exercise.difficulty === "difficile"
                        ? "bg-orange-100 text-orange-700"
                        : exercise.difficulty === "extreme"
                        ? "bg-red-100 text-red-700"
                        : exercise.difficulty === "primaire"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {exercise.difficulty.charAt(0).toUpperCase() +
                      exercise.difficulty.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {DIFFICULTY_RANGES[exercise.difficulty]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDelete(exercise.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
                aria-label="Delete exercise"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}