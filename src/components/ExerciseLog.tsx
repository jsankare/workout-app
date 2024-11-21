import type { ExerciseLog } from '../types';

interface Props {
  logs: ExerciseLog[];
  onClearLogs: () => void;
}

export function ExerciseLog({ logs, onClearLogs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/20">
        <p className="text-purple-300 text-center">Aucun exercice complété</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-300">Exercices complétés</h2>
        <button
          onClick={onClearLogs}
          className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
        >
          Effacer
        </button>
      </div>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.exerciseId} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg border border-purple-500/20">
            <div>
              <span className="font-medium text-purple-200">{log.name}</span>
              {log.count > 1 && (
                <span className="ml-2 text-sm text-purple-400">(x{log.count})</span>
              )}
            </div>
            <span className="font-bold text-purple-300">{log.totalReps} reps</span>
          </div>
        ))}
      </div>
    </div>
  );
}