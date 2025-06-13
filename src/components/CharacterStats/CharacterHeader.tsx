import React from 'react';
import { Character } from '../../types/game';
import { CharacterAvatarWithTooltip } from '../CharacterAvatar';
import { calculateExpProgress } from '../../utils/characterStats';

interface CharacterHeaderProps {
  character: Character;
}

/**
 * Character header component showing avatar, name, job, level and experience
 */
export const CharacterHeader: React.FC<CharacterHeaderProps> = React.memo(({ character }) => {
  const { progress: expProgress } = calculateExpProgress(character);

  return (
    <div className="relative bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 p-3 border-b border-purple-500/30">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <CharacterAvatarWithTooltip 
            character={character} 
            size="medium" 
            showBorder={true}
            showLevel={true}
            className="ring-2 ring-purple-500/50"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white mb-1 truncate">{character.name}</h2>
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full font-medium">
              {character.job}
            </span>
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-2 py-1 rounded-full font-medium">
              Lv.{character.level}
            </span>
          </div>
        </div>
        
        {/* Experience bar - vertical on the right */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-purple-300 mb-1">EXP</span>
          <div className="w-4 h-16 bg-slate-700/80 rounded-full overflow-hidden rotate-180">
            <div 
              className="bg-gradient-to-t from-purple-500 to-blue-500 w-full transition-all duration-1000 ease-out"
              style={{ height: `${Math.max(2, expProgress)}%` }}
            />
          </div>
          <span className="text-xs text-white font-bold mt-1">{Math.round(expProgress)}%</span>
        </div>
      </div>
    </div>
  );
});

CharacterHeader.displayName = 'CharacterHeader'; 