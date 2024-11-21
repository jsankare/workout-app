import { useState } from 'react';
import type { Achievement } from '../types';

interface Props {
  achievements: Achievement[];
}

export function Achievements({ achievements }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');

  const categories = {
    all: 'Tous',
    reps: 'Répétitions',
    variety: 'Variété',
    time: 'Temps',
    streak: 'Régularité',
    difficulty: 'Difficulté'
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-purple-300">Succès</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Achievement['category'] | 'all')}
          className="px-3 py-1.5 bg-gray-700 text-purple-300 border border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-400"
        >
          {Object.entries(categories).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border ${
              achievement.unlockedAt
                ? 'bg-purple-900/20 border-purple-500'
                : 'bg-gray-700/50 border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium text-purple-200">{achievement.title}</h3>
                <p className="text-sm text-purple-400">{achievement.description}</p>
                {!achievement.unlockedAt && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (achievement.currentProgress / achievement.requirement) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-purple-400 mt-1">
                      {achievement.currentProgress} / {achievement.requirement}
                    </p>
                  </div>
                )}
                {achievement.unlockedAt && (
                  <p className="text-xs text-purple-400 mt-1">
                    Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}