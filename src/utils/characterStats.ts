import React from 'react';
import { Character } from '../types/game';
import { WorldManager } from '../data/worldSettings';
import { 
  Shield, Brain, Zap, Heart, Coins, Award, Package, Cpu, Activity, 
  Target, Wrench, ThermometerSun, Star, Users, Crown, Sword 
} from 'lucide-react';

export interface StatInfo {
  icon: JSX.Element;
  color: string;
}

export interface StatValue {
  current: number;
  max: number;
  percentage: number;
}

/**
 * Get icon and color for a stat based on world context
 */
export const getStatIcon = (statKey: string, size: string = 'w-5 h-5'): StatInfo => {
  const currentWorld = WorldManager.getCurrentWorld();
  
  if (currentWorld.id === 'dark_finance') {
    const darkFinanceIcons: { [key: string]: StatInfo } = {
      capital: { icon: React.createElement(Coins, { className: `${size} mr-2` }), color: 'text-green-400' },
      information: { icon: React.createElement(Brain, { className: `${size} mr-2` }), color: 'text-blue-400' },
      network: { icon: React.createElement(Users, { className: `${size} mr-2` }), color: 'text-purple-400' },
      technical: { icon: React.createElement(Cpu, { className: `${size} mr-2` }), color: 'text-cyan-400' },
      psychology: { icon: React.createElement(Activity, { className: `${size} mr-2` }), color: 'text-pink-400' },
      reputation: { icon: React.createElement(Crown, { className: `${size} mr-2` }), color: 'text-yellow-400' },
    };
    return darkFinanceIcons[statKey] || { icon: React.createElement(Shield, { className: `${size} mr-2` }), color: 'text-gray-400' };
  }

  const iconMap: { [key: string]: StatInfo } = {
    // Fantasy stats
    health: { icon: React.createElement(Heart, { className: `${size} mr-2` }), color: 'text-red-400' },
    mana: { icon: React.createElement(Zap, { className: `${size} mr-2` }), color: 'text-blue-400' },
    strength: { icon: React.createElement(Sword, { className: `${size} mr-2` }), color: 'text-red-500' },
    intelligence: { icon: React.createElement(Brain, { className: `${size} mr-2` }), color: 'text-blue-500' },
    dexterity: { icon: React.createElement(Zap, { className: `${size} mr-2` }), color: 'text-yellow-400' },
    constitution: { icon: React.createElement(Shield, { className: `${size} mr-2` }), color: 'text-green-400' },
    
    // Cyberpunk stats
    body: { icon: React.createElement(Activity, { className: `${size} mr-2` }), color: 'text-red-400' },
    neural: { icon: React.createElement(Cpu, { className: `${size} mr-2` }), color: 'text-blue-400' },
    reflex: { icon: React.createElement(Target, { className: `${size} mr-2` }), color: 'text-yellow-400' },
    technical: { icon: React.createElement(Wrench, { className: `${size} mr-2` }), color: 'text-green-400' },
    cool: { icon: React.createElement(ThermometerSun, { className: `${size} mr-2` }), color: 'text-purple-400' },
    reputation: { icon: React.createElement(Star, { className: `${size} mr-2` }), color: 'text-orange-400' },
  };
  
  return iconMap[statKey] || { icon: React.createElement(Shield, { className: `${size} mr-2` }), color: 'text-gray-400' };
};

/**
 * Get character stat value with world-specific mapping
 */
export const getStatValue = (character: Character, statKey: string): number => {
  const characterStats: { [key: string]: any } = character;
  const currentWorld = WorldManager.getCurrentWorld();
  
  if (currentWorld.id === 'cyberpunk_2187') {
    const mappingTable: { [key: string]: string } = {
      'body': 'health',
      'neural': 'mana', 
      'reflex': 'dexterity',
      'technical': 'intelligence',
      'cool': 'constitution',
      'reputation': 'strength'
    };
    
    const mappedKey = mappingTable[statKey] || statKey;
    return characterStats[mappedKey] || 0;
  }
  
  if (currentWorld.id === 'dark_finance') {
    const mappingTable: { [key: string]: string } = {
      'capital': 'gold',
      'information': 'intelligence',
      'network': 'dexterity',
      'technical': 'constitution',
      'psychology': 'strength',
      'reputation': 'experience'
    };
    
    const mappedKey = mappingTable[statKey] || statKey;
    return characterStats[mappedKey] || 0;
  }
  
  return characterStats[statKey] || 0;
};

/**
 * Check if stat is a primary resource (health/mana equivalent)
 */
export const isPrimaryResource = (statKey: string): boolean => {
  return ['health', 'mana', 'body', 'neural'].includes(statKey);
};

/**
 * Get max value for a stat
 */
export const getMaxStatValue = (character: Character, statKey: string): number => {
  const currentWorld = WorldManager.getCurrentWorld();
  const currentValue = getStatValue(character, statKey);
  
  if (currentWorld.id === 'cyberpunk_2187') {
    if (statKey === 'body') return character.maxHealth || currentValue;
    if (statKey === 'neural') return character.maxMana || currentValue;
  } else {
    const maxKey = `max${statKey.charAt(0).toUpperCase() + statKey.slice(1)}`;
    return (character as any)[maxKey] || currentValue;
  }
  
  return currentValue;
};

/**
 * Calculate stat with current and max values
 */
export const calculateStatValue = (character: Character, statKey: string): StatValue => {
  const current = getStatValue(character, statKey);
  const max = getMaxStatValue(character, statKey);
  const percentage = max > 0 ? (current / max) * 100 : 0;
  
  return { current, max, percentage };
};

/**
 * Get item icon emoji
 */
export const getItemIcon = (itemName: string): string => {
  const name = itemName.toLowerCase();
  if (name.includes('검') || name.includes('sword') || name.includes('blade')) return '⚔️';
  if (name.includes('방패') || name.includes('shield')) return '🛡️';
  if (name.includes('물약') || name.includes('potion')) return '🧪';
  if (name.includes('갑옷') || name.includes('armor')) return '👕';
  if (name.includes('반지') || name.includes('ring')) return '💍';
  if (name.includes('목걸이') || name.includes('necklace')) return '📿';
  if (name.includes('부츠') || name.includes('boots')) return '👢';
  if (name.includes('헬멧') || name.includes('helmet')) return '⛑️';
  if (name.includes('마법') || name.includes('magic')) return '✨';
  if (name.includes('열쇠') || name.includes('key')) return '🗝️';
  if (name.includes('보석') || name.includes('gem')) return '💎';
  if (name.includes('두루마리') || name.includes('scroll')) return '📜';
  if (name.includes('화살') || name.includes('arrow')) return '🏹';
  if (name.includes('활') || name.includes('bow')) return '🏹';
  if (name.includes('총') || name.includes('gun') || name.includes('rifle')) return '🔫';
  if (name.includes('데이터') || name.includes('data')) return '💾';
  if (name.includes('칩') || name.includes('chip')) return '🔌';
  if (name.includes('장비') || name.includes('equipment')) return '⚙️';
  return '📦';
};

/**
 * Get item type in Korean
 */
export const getItemType = (item: any): string => {
  const type = item.type?.toLowerCase() || '';
  const name = item.name?.toLowerCase() || '';
  
  if (type.includes('weapon') || name.includes('검') || name.includes('총')) return '무기';
  if (type.includes('armor') || name.includes('갑옷') || name.includes('방어구')) return '방어구';
  if (type.includes('accessory') || name.includes('반지') || name.includes('목걸이')) return '장신구';
  if (type.includes('consumable') || name.includes('물약') || name.includes('포션')) return '소모품';
  if (type.includes('equipment') || name.includes('장비')) return '장비';
  if (type.includes('data') || name.includes('데이터')) return '데이터';
  if (type.includes('chip') || name.includes('칩')) return '사이버 칩';
  if (type.includes('key') || name.includes('열쇠')) return '특수 아이템';
  return '일반 아이템';
};

/**
 * Get skill type in Korean
 */
export const getSkillType = (skill: any): string => {
  const name = skill.name?.toLowerCase() || skill.toLowerCase();
  
  if (name.includes('해킹') || name.includes('hack')) return '해킹 스킬';
  if (name.includes('데이터') || name.includes('data')) return '데이터 스킬';
  if (name.includes('ai') || name.includes('통제') || name.includes('제어')) return 'AI 제어';
  if (name.includes('공격') || name.includes('attack') || name.includes('전투')) return '전투 스킬';
  if (name.includes('방어') || name.includes('defense') || name.includes('보호')) return '방어 스킬';
  if (name.includes('회복') || name.includes('heal') || name.includes('치료')) return '회복 스킬';
  if (name.includes('마법') || name.includes('magic') || name.includes('spell')) return '마법 스킬';
  if (name.includes('정찰') || name.includes('scout') || name.includes('탐지')) return '정찰 스킬';
  return '특수 스킬';
};

/**
 * Get skill icon emoji
 */
export const getSkillIcon = (skill: any): string => {
  const name = skill.name?.toLowerCase() || skill.toLowerCase();
  
  if (name.includes('해킹') || name.includes('hack')) return '💻';
  if (name.includes('데이터') || name.includes('data')) return '💾';
  if (name.includes('ai') || name.includes('통제') || name.includes('제어')) return '🤖';
  if (name.includes('공격') || name.includes('attack') || name.includes('전투')) return '⚔️';
  if (name.includes('방어') || name.includes('defense') || name.includes('보호')) return '🛡️';
  if (name.includes('회복') || name.includes('heal') || name.includes('치료')) return '💚';
  if (name.includes('마법') || name.includes('magic') || name.includes('spell')) return '✨';
  if (name.includes('정찰') || name.includes('scout') || name.includes('탐지')) return '🔍';
  return '⭐';
};

/**
 * Get bar color class for stat bars
 */
export const getBarColor = (statKey: string): string => {
  if (['health', 'body'].includes(statKey)) return 'from-red-500 to-red-400';
  if (['mana', 'neural'].includes(statKey)) return 'from-blue-500 to-blue-400';
  return 'from-green-500 to-green-400';
};

/**
 * Calculate experience progress to next level
 */
export const calculateExpProgress = (character: Character): { progress: number; toNext: number } => {
  const toNext = character.level * 100;
  const progress = (character.experience / toNext) * 100;
  return { progress, toNext };
}; 