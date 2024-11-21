import type { WorkoutStats } from '../types';

interface Props {
  stats: WorkoutStats;
}

export function Stats({ stats }: Props) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/20">
      <h2 className="text-xl font-bold text-purple-300 mb-4">Statistiques</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon="🎯"
          title="Total Répétitions"
          value={stats.totalReps.toString()}
        />
        <StatCard
          icon="⏱️"
          title="Temps Total"
          value={`${Math.floor(stats.totalTime / (60 * 1000))} min`}
        />
        <StatCard
          icon="🎨"
          title="Exercices Uniques"
          value={stats.uniqueExercises.size.toString()}
        />
        <StatCard
          icon="🔥"
          title="Série Actuelle"
          value={`${stats.currentStreak} jours`}
        />
        <StatCard
          icon="⭐"
          title="Plus Longue Série"
          value={`${stats.longestStreak} jours`}
        />
        <StatCard
          icon="📅"
          title="Jours d'Entraînement"
          value={stats.workoutDays.size.toString()}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-purple-300 mb-3">Exercices par Difficulté</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(stats.difficultyCount).map(([difficulty, count]) => (
            <div
              key={difficulty}
              className="bg-gray-700/50 p-3 rounded-lg border border-purple-500/20"
            >
              <div className="text-sm text-purple-400 capitalize">{difficulty}</div>
              <div className="text-lg font-medium text-purple-200">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="bg-gray-700/50 p-4 rounded-lg border border-purple-500/20">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-sm text-purple-400">{title}</div>
          <div className="text-lg font-medium text-purple-200">{value}</div>
        </div>
      </div>
    </div>
  );
}