import React from 'react';
import { Character } from '../types/game';
import { WorldManager } from '../data/worldSettings';
import { getAvatarByJobName, getPatternClasses } from '../data/avatars';

interface CharacterAvatarProps {
  character: Character;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
  showLevel?: boolean;
  className?: string;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ 
  character, 
  size = 'medium', 
  showBorder = true,
  showLevel = true,
  className = ''
}) => {
  const currentWorld = WorldManager.getCurrentWorld();
  const avatarData = getAvatarByJobName(character.job, currentWorld.id);

  // 크기별 스타일
  const sizeClasses = {
    small: {
      container: 'w-12 h-12',
      icon: 'text-lg',
      level: 'text-xs px-1 py-0.5'
    },
    medium: {
      container: 'w-20 h-20',
      icon: 'text-2xl',
      level: 'text-xs px-2 py-1'
    },
    large: {
      container: 'w-32 h-32',
      icon: 'text-4xl',
      level: 'text-sm px-2 py-1'
    }
  };

  const currentSize = sizeClasses[size];

  if (!avatarData) {
    // 기본 아바타 (아바타 데이터가 없는 경우)
    return (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border-2 border-gray-600">
          <span className={`${currentSize.icon} text-gray-300`}>👤</span>
        </div>
        {showLevel && (
          <div className={`absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full ${currentSize.level} font-bold`}>
            {character.level}
          </div>
        )}
      </div>
    );
  }

  const patternClasses = getPatternClasses(avatarData.pattern);
  const borderClass = showBorder ? 'border-2' : '';

  return (
    <div className={`relative ${currentSize.container} ${className}`}>
      {/* 메인 아바타 */}
      <div 
        className={`w-full h-full bg-gradient-to-br ${avatarData.backgroundColor} rounded-full flex items-center justify-center ${borderClass} border-opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
        style={{ borderColor: avatarData.primaryColor }}
      >
        {/* 패턴 오버레이 */}
        <div 
          className={`absolute inset-0 rounded-full ${patternClasses}`}
          style={{ 
            background: `radial-gradient(circle, ${avatarData.secondaryColor}20 0%, transparent 70%)`
          }}
        />
        
        {/* 직업 아이콘 */}
        <span 
          className={`relative z-10 ${currentSize.icon} filter drop-shadow-lg`}
          style={{ color: avatarData.primaryColor }}
        >
          {avatarData.icon}
        </span>

        {/* 빛 효과 */}
        <div 
          className="absolute inset-2 rounded-full opacity-30 animate-pulse"
          style={{ 
            background: `radial-gradient(circle, ${avatarData.primaryColor}40 0%, transparent 60%)`
          }}
        />
      </div>

      {/* 레벨 배지 */}
      {showLevel && (
        <div 
          className={`absolute -bottom-1 -right-1 text-white rounded-full ${currentSize.level} font-bold shadow-lg`}
          style={{ backgroundColor: avatarData.primaryColor }}
        >
          {character.level}
        </div>
      )}

      {/* 체력/마나 상태 표시 (large 사이즈에서만) */}
      {size === 'large' && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {/* 체력 표시 */}
          <div className="w-2 h-2 rounded-full bg-red-500 opacity-75" 
               style={{ 
                 opacity: (character.health / character.maxHealth) > 0.5 ? 0.75 : 0.3 
               }} 
          />
          {/* 마나 표시 */}
          <div className="w-2 h-2 rounded-full bg-blue-500 opacity-75"
               style={{ 
                 opacity: (character.mana / character.maxMana) > 0.5 ? 0.75 : 0.3 
               }}
          />
        </div>
      )}
    </div>
  );
};

// 호버 시 상세 정보를 보여주는 래퍼 컴포넌트
export const CharacterAvatarWithTooltip: React.FC<CharacterAvatarProps & { showTooltip?: boolean }> = ({ 
  showTooltip = true, 
  ...props 
}) => {
  const currentWorld = WorldManager.getCurrentWorld();
  const avatarData = getAvatarByJobName(props.character.job, currentWorld.id);

  if (!showTooltip || !avatarData) {
    return <CharacterAvatar {...props} />;
  }

  return (
    <div className="relative group">
      <CharacterAvatar {...props} />
      
      {/* 툴팁 */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        <div className="font-bold">{avatarData.name}</div>
        <div className="text-gray-300 text-xs">{avatarData.description}</div>
        <div className="text-gray-400 text-xs">레벨 {props.character.level}</div>
        
        {/* 화살표 */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default CharacterAvatar; 