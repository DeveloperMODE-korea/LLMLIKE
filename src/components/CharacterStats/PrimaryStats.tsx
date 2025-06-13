import React, { useMemo } from 'react';
import { Character } from '../../types/game';
import { WorldManager } from '../../data/worldSettings';
import { 
  getStatIcon, 
  getStatValue, 
  isPrimaryResource, 
  calculateStatValue,
  getBarColor
} from '../../utils/characterStats';

interface PrimaryStatsProps {
  character: Character;
}

/**
 * Primary stats component displaying health, mana and other main resources
 */
export const PrimaryStats: React.FC<PrimaryStatsProps> = React.memo(({ character }) => {
  const currentWorld = WorldManager.getCurrentWorld();
  const statNames = currentWorld.statNames;

  const primaryStats = useMemo(() => 
    Object.keys(statNames).filter(isPrimaryResource),
    [statNames]
  );

  const renderPrimaryStat = (statKey: string) => {
    const { current, max, percentage } = calculateStatValue(character, statKey);
    const statInfo = getStatIcon(statKey, 'w-5 h-5');
    const barColorClass = getBarColor(statKey);

    return (
      <div 
        key={statKey} 
        className="bg-slate-700/80 rounded-lg p-3 border border-slate-600/50 hover:bg-slate-600/80 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center ${statInfo.color}`}>
            {statInfo.icon}
            <span className="font-bold text-sm">{statNames[statKey]}</span>
          </div>
          <span className="text-lg font-bold text-white">
            {current}<span className="text-gray-400 text-xs">/{max}</span>
          </span>
        </div>
        
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${barColorClass} h-2 rounded-full transition-all duration-500 relative`}
            style={{ width: `${Math.max(2, percentage)}%` }}
          >
            {percentage < 30 && (
              <div className="absolute inset-0 animate-pulse bg-red-500/30 rounded-full" />
            )}
          </div>
        </div>
        
        <div className="mt-1 text-right">
          <span className={`text-xs font-medium ${
            percentage > 70 ? 'text-green-400' : 
            percentage > 30 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {primaryStats.map(renderPrimaryStat)}
    </div>
  );
});

PrimaryStats.displayName = 'PrimaryStats'; 