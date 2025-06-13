import React, { useMemo } from 'react';
import { Character } from '../../types/game';
import { WorldManager } from '../../data/worldSettings';
import { Coins, Star, Package, TrendingUp } from 'lucide-react';
import { 
  getStatIcon, 
  getStatValue, 
  isPrimaryResource 
} from '../../utils/characterStats';

interface SecondaryStatsProps {
  character: Character;
}

/**
 * Secondary stats component showing strength, dexterity and other attributes
 */
export const SecondaryStats: React.FC<SecondaryStatsProps> = React.memo(({ character }) => {
  const currentWorld = WorldManager.getCurrentWorld();
  const statNames = currentWorld.statNames;

  const secondaryStats = useMemo(() => 
    Object.keys(statNames).filter(key => !isPrimaryResource(key)),
    [statNames]
  );

  const renderSecondaryStat = (statKey: string) => {
    const statValue = getStatValue(character, statKey);
    const statInfo = getStatIcon(statKey, 'w-4 h-4');

    return (
      <div key={statKey} className="bg-slate-600/50 rounded p-2 text-center">
        <div className={`flex items-center justify-center ${statInfo.color} mb-1`}>
          {statInfo.icon}
        </div>
        <div className="text-lg font-bold text-white">{statValue}</div>
        <div className="text-xs text-gray-400">{statNames[statKey]}</div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Gold, Skills, Items overview */}
      <div className="grid grid-cols-3 gap-3">
        {/* Gold */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-yellow-400 mb-1">
                <Coins className="w-4 h-4 mr-1" />
                <span className="text-xs">자산</span>
              </div>
              <div className="text-lg font-bold text-yellow-400">{character.gold.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Skills preview */}
        <div className="bg-slate-700/80 border border-purple-500/30 rounded-lg p-3">
          <div className="flex items-center text-purple-400 mb-2">
            <Star className="w-4 h-4 mr-1" />
            <span className="text-xs font-bold">스킬</span>
          </div>
          <div className="text-lg font-bold text-white">{character.skills?.length || 0}</div>
          <div className="text-xs text-gray-400">보유 중</div>
        </div>

        {/* Items preview */}
        <div className="bg-slate-700/80 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center text-green-400 mb-2">
            <Package className="w-4 h-4 mr-1" />
            <span className="text-xs font-bold">아이템</span>
          </div>
          <div className="text-lg font-bold text-white">{character.inventory?.length || 0}</div>
          <div className="text-xs text-gray-400">보유 중</div>
        </div>
      </div>

      {/* Secondary attributes */}
      <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
          능력치
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {secondaryStats.map(renderSecondaryStat)}
        </div>
      </div>
    </div>
  );
});

SecondaryStats.displayName = 'SecondaryStats'; 