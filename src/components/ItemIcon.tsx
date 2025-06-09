import React from 'react';
import { getItemIcon, getRarityColors } from '../data/itemIcons';

interface ItemIconProps {
  itemName: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  showRarity?: boolean;
  className?: string;
}

const ItemIcon: React.FC<ItemIconProps> = ({
  itemName,
  description,
  size = 'medium',
  showTooltip = true,
  showRarity = true,
  className = ''
}) => {
  const iconData = getItemIcon(itemName);
  
  if (!iconData) {
    return null;
  }

  const rarityColors = getRarityColors(iconData.rarity);

  // 크기별 스타일
  const sizeClasses = {
    small: {
      container: 'w-8 h-8',
      icon: 'text-sm',
      border: 'border'
    },
    medium: {
      container: 'w-10 h-10',
      icon: 'text-lg',
      border: 'border-2'
    },
    large: {
      container: 'w-12 h-12',
      icon: 'text-xl',
      border: 'border-2'
    }
  };

  const currentSize = sizeClasses[size];

  // 등급별 애니메이션
  const rarityAnimation = {
    common: '',
    uncommon: 'hover:animate-pulse',
    rare: 'hover:animate-pulse',
    epic: 'animate-pulse hover:animate-bounce',
    legendary: 'animate-pulse hover:animate-bounce'
  };

  const IconComponent = (
    <div className={`relative ${currentSize.container} ${className}`}>
      {/* 메인 아이콘 컨테이너 */}
      <div
        className={`w-full h-full rounded-lg ${currentSize.border} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${rarityAnimation[iconData.rarity]} cursor-pointer`}
        style={{
          backgroundColor: iconData.backgroundColor,
          borderColor: showRarity ? rarityColors.borderColor : '#4b5563',
          boxShadow: showRarity && (iconData.rarity === 'epic' || iconData.rarity === 'legendary') 
            ? `0 0 12px ${rarityColors.glowColor}` 
            : 'none'
        }}
      >
        {/* 아이콘 */}
        <span
          className={`${currentSize.icon} filter drop-shadow-sm`}
          style={{ color: iconData.color }}
        >
          {iconData.icon}
        </span>

        {/* 등급 표시 (legendary/epic인 경우만) */}
        {showRarity && (iconData.rarity === 'legendary' || iconData.rarity === 'epic') && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white"
            style={{ backgroundColor: rarityColors.borderColor }}
          />
        )}

        {/* 반짝임 효과 (legendary인 경우) */}
        {iconData.rarity === 'legendary' && (
          <div className="absolute inset-0 rounded-lg opacity-30 animate-ping"
               style={{ backgroundColor: rarityColors.borderColor }} />
        )}
      </div>
    </div>
  );

  // 툴팁 래퍼
  if (showTooltip) {
    return (
      <div className="relative group">
        {IconComponent}
        
        {/* 툴팁 */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="font-bold" style={{ color: rarityColors.borderColor }}>
            {itemName}
          </div>
          {description && (
            <div className="text-gray-300 text-xs mt-1">{description}</div>
          )}
          <div className="text-xs mt-1 capitalize" style={{ color: rarityColors.borderColor }}>
            {iconData.rarity} {iconData.category}
          </div>
          
          {/* 화살표 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return IconComponent;
};

// 인벤토리용 간단한 아이템 아이콘 컴포넌트
export const SimpleItemIcon: React.FC<{ itemName: string; size?: 'small' | 'medium' }> = ({ 
  itemName, 
  size = 'small' 
}) => {
  return (
    <ItemIcon 
      itemName={itemName} 
      size={size} 
      showTooltip={false} 
      showRarity={false}
      className="mr-2"
    />
  );
};

// 상세 정보가 포함된 아이템 아이콘 컴포넌트
export const DetailedItemIcon: React.FC<{ itemName: string; description?: string }> = ({ 
  itemName, 
  description 
}) => {
  return (
    <ItemIcon 
      itemName={itemName} 
      description={description}
      size="medium" 
      showTooltip={true} 
      showRarity={true}
    />
  );
};

export default ItemIcon; 