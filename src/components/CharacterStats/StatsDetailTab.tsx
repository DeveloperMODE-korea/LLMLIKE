import React, { useMemo } from 'react';
import { Character } from '../../types/game';
import { WorldManager } from '../../data/worldSettings';
import { getStatIcon, getStatValue } from '../../utils/characterStats';

interface StatsDetailTabProps {
  character: Character;
}

/**
 * Detailed stats tab component showing all character attributes
 */
export const StatsDetailTab: React.FC<StatsDetailTabProps> = React.memo(({ character }) => {
  const currentWorld = WorldManager.getCurrentWorld();
  const statNames = currentWorld.statNames;

  const allStats = useMemo(() => Object.keys(statNames), [statNames]);

  const renderDetailedStat = (statKey: string) => {
    const statValue = getStatValue(character, statKey);
    const statInfo = getStatIcon(statKey);

    return (
      <div 
        key={statKey} 
        className="bg-slate-700/80 rounded-lg p-3 border border-slate-600/50 hover:bg-slate-600/80 transition-colors"
      >
        <div className={`flex items-center ${statInfo.color} mb-2`}>
          {statInfo.icon}
          <span className="font-bold text-sm">{statNames[statKey]}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{statValue}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {allStats.map(renderDetailedStat)}
    </div>
  );
});

StatsDetailTab.displayName = 'StatsDetailTab'; 