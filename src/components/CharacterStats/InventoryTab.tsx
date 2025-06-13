import React, { useMemo } from 'react';
import { Character } from '../../types/game';
import { Star, Package } from 'lucide-react';
import { 
  getItemIcon, 
  getItemType, 
  getSkillIcon, 
  getSkillType 
} from '../../utils/characterStats';

interface InventoryTabProps {
  character: Character;
}

interface Skill {
  id?: string;
  name: string;
  description?: string;
  manaCost?: number;
}

interface Item {
  id?: string;
  name: string;
  description?: string;
  type?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  stats?: Record<string, number>;
}

/**
 * Inventory tab component displaying skills and items
 */
export const InventoryTab: React.FC<InventoryTabProps> = React.memo(({ character }) => {
  const skills = useMemo(() => character.skills || [], [character.skills]);
  const items = useMemo(() => character.inventory || [], [character.inventory]);

  const renderSkill = (skill: Skill | string, index: number) => {
    const skillData = typeof skill === 'string' ? { name: skill } : skill;
    const skillName = skillData.name;

    return (
      <div 
        key={skillData.id || index} 
        className="bg-slate-600/50 rounded-lg p-3 border border-purple-500/20 hover:bg-slate-500/50 transition-colors group"
        title={skillName}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
              <span className="text-lg">{getSkillIcon(skill)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-purple-300 text-sm group-hover:text-purple-200 transition-colors">
                {skillName}
              </div>
              <div className="text-xs text-purple-400 font-medium">
                {getSkillType(skill)}
              </div>
              {skillData.description && (
                <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {skillData.description}
                </div>
              )}
            </div>
          </div>
          {skillData.manaCost && skillData.manaCost > 0 && (
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-2 py-1">
              <div className="text-blue-400 font-bold text-sm">{skillData.manaCost}</div>
              <div className="text-blue-300 text-xs">MP</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderItem = (item: Item | string, index: number) => {
    const itemData = typeof item === 'string' ? { name: item } : item;
    const itemName = itemData.name;

    const getRarityStyle = (rarity?: string) => {
      switch (rarity) {
        case 'legendary': return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
        case 'epic': return 'text-purple-400 bg-purple-500/10 border border-purple-500/20';
        case 'rare': return 'text-blue-400 bg-blue-500/10 border border-blue-500/20';
        default: return 'text-gray-400 bg-gray-500/10 border border-gray-500/20';
      }
    };

    const getRarityText = (rarity?: string) => {
      switch (rarity) {
        case 'legendary': return '전설';
        case 'epic': return '영웅';
        case 'rare': return '희귀';
        default: return '일반';
      }
    };

    return (
      <div 
        key={itemData.id || index} 
        className="bg-slate-600/50 rounded-lg p-3 border border-green-500/20 hover:bg-slate-500/50 transition-colors group"
        title={itemName}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
            <span className="text-lg">{getItemIcon(itemName)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-green-300 text-sm group-hover:text-green-200 transition-colors">
              {itemName}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                {getItemType(itemData)}
              </span>
              {itemData.rarity && (
                <span className={`text-xs font-medium px-2 py-1 rounded ${getRarityStyle(itemData.rarity)}`}>
                  {getRarityText(itemData.rarity)}
                </span>
              )}
            </div>
            {itemData.description && (
              <div className="text-xs text-gray-400 mt-2 leading-relaxed">
                {itemData.description}
              </div>
            )}
            {itemData.stats && Object.keys(itemData.stats).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(itemData.stats).map(([stat, value]) => (
                  <span key={stat} className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                    {stat} +{value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = ({ type, icon: Icon, title, subtitle }: {
    type: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
  }) => (
    <div className="text-center text-gray-400 py-6">
      <div className={`w-16 h-16 bg-${type}-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-${type}-500/20`}>
        <Icon className={`w-8 h-8 opacity-50 text-${type}-400`} />
      </div>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Skills section */}
      <div className="bg-slate-700/50 rounded-lg p-3 border border-purple-500/30">
        <h4 className="font-bold text-purple-300 mb-3 flex items-center">
          <Star className="w-4 h-4 mr-2" />
          보유 스킬 ({skills.length}개)
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {skills.length > 0 ? (
            skills.map(renderSkill)
          ) : (
            <EmptyState
              type="purple"
              icon={Star}
              title="보유한 스킬이 없습니다"
              subtitle="스킬을 습득하여 능력을 강화하세요"
            />
          )}
        </div>
      </div>

      {/* Items section */}
      <div className="bg-slate-700/50 rounded-lg p-3 border border-green-500/30">
        <h4 className="font-bold text-green-300 mb-3 flex items-center">
          <Package className="w-4 h-4 mr-2" />
          보유 아이템 ({items.length}개)
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {items.length > 0 ? (
            items.map(renderItem)
          ) : (
            <EmptyState
              type="green"
              icon={Package}
              title="보유한 아이템이 없습니다"
              subtitle="모험을 통해 아이템을 수집하세요"
            />
          )}
        </div>
      </div>
    </div>
  );
});

InventoryTab.displayName = 'InventoryTab'; 