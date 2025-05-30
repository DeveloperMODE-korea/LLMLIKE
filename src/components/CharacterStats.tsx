import React from 'react';
import { Character } from '../types/game';
import { Shield, Brain, Zap, Heart, Coins, Award } from 'lucide-react';

interface CharacterStatsProps {
  character: Character;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 h-full">
      <h3 className="text-xl font-bold mb-2 text-purple-300">{character.name}</h3>
      <div className="text-sm text-yellow-400 mb-3">레벨 {character.level} {character.job}</div>
      
      {/* 체력과 마나 바 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm flex items-center">
            <Heart className="w-4 h-4 text-red-500 mr-1" />
            체력
          </span>
          <span className="text-sm">{character.health}/{character.maxHealth}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className="bg-red-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${Math.max(0, (character.health / character.maxHealth) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm flex items-center">
            <Zap className="w-4 h-4 text-blue-500 mr-1" />
            마나
          </span>
          <span className="text-sm">{character.mana}/{character.maxMana}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className="bg-blue-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${Math.max(0, (character.mana / character.maxMana) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* 경험치 바 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm flex items-center">
            <Award className="w-4 h-4 text-purple-400 mr-1" />
            경험치
          </span>
          <span className="text-sm">{character.experience}/{character.level * 100}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className="bg-purple-500 rounded-full h-2 transition-all duration-300"
            style={{ width: `${Math.max(0, (character.experience / (character.level * 100)) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* 스탯 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center">
          <Shield className="w-4 h-4 text-red-400 mr-1" />
          <span className="text-sm text-gray-300">힘: {character.strength}</span>
        </div>
        <div className="flex items-center">
          <Brain className="w-4 h-4 text-blue-400 mr-1" />
          <span className="text-sm text-gray-300">지능: {character.intelligence}</span>
        </div>
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm text-gray-300">민첩: {character.dexterity}</span>
        </div>
        <div className="flex items-center">
          <Heart className="w-4 h-4 text-green-400 mr-1" />
          <span className="text-sm text-gray-300">체질: {character.constitution}</span>
        </div>
      </div>
      
      {/* 골드 */}
      <div className="flex items-center mb-4">
        <Coins className="w-4 h-4 text-yellow-500 mr-2" />
        <span className="text-yellow-500">{character.gold} 골드</span>
      </div>
      
      {/* 스킬 */}
      <h4 className="text-sm font-bold text-purple-300 mb-2">스킬</h4>
      
      <ul className="space-y-1">
        {character.skills.map(skill => (
          <li key={skill.id} className="text-sm">
            <span className="text-yellow-300">{skill.name}</span>
            {skill.manaCost > 0 && <span className="text-blue-400 ml-1">({skill.manaCost} MP)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterStats;