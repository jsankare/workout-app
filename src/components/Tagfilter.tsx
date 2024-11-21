import { XCircle } from 'lucide-react';

interface Props {
  existingTags: string[];
  selectedTag: string | null;
  excludedTags: string[];
  onSelectTag: (tag: string | null) => void;
  onToggleExcludeTag: (tag: string) => void;
}

export function TagFilter({
  existingTags,
  selectedTag,
  excludedTags,
  onSelectTag,
  onToggleExcludeTag,
}: Props) {
  return (
    <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/20">
      <div>
        <label htmlFor="tagFilter" className="block text-purple-300 font-medium mb-2">
          Filtrer par tag :
        </label>
        <select
          id="tagFilter"
          value={selectedTag || ''}
          onChange={(e) => onSelectTag(e.target.value || null)}
          className="w-full p-2 bg-gray-700 text-purple-300 border border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Tous les exercices</option>
          {existingTags.map(tag => (
            <option key={`filter-${tag}`} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-purple-300 font-medium mb-2">Tags exclus de la roulette :</h3>
        <div className="flex flex-wrap gap-2">
          {existingTags.map(tag => (
            <button
              key={`exclude-${tag}`}
              onClick={() => onToggleExcludeTag(tag)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                transition-colors duration-200
                ${
                  excludedTags.includes(tag)
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                    : 'bg-gray-700 text-purple-300 hover:bg-gray-600'
                }
              `}
            >
              <span>{tag}</span>
              <XCircle
                size={16}
                className={`
                  transition-opacity duration-200
                  ${excludedTags.includes(tag) ? 'opacity-100' : 'opacity-0'}
                `}
              />
            </button>
          ))}
        </div>
        <p className="text-purple-400/60 text-sm mt-2">
          Cliquez sur un tag pour l'exclure/inclure dans la roulette
        </p>
      </div>
    </div>
  );
}