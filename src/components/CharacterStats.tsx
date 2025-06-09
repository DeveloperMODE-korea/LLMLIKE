import React, { useState } from 'react';
import { Character } from '../types/game';
import { Shield, Brain, Zap, Heart, Coins, Award, Package, Cpu, Activity, Target, Wrench, ThermometerSun, Star, Users, Scroll, TrendingUp, Crown, Sword } from 'lucide-react';
import { WorldManager } from '../data/worldSettings';
import { CharacterAvatarWithTooltip } from './CharacterAvatar';
import { SimpleItemIcon } from './ItemIcon';
import AdvancedSystemsDashboard from './AdvancedSystemsDashboard';

interface CharacterStatsProps {
  character: Character;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'inventory' | 'advanced'>('overview');
  
  // 현재 세계관 정보 가져오기
  const currentWorld = WorldManager.getCurrentWorld();
  const statNames = currentWorld.statNames;

  // 능력치별 아이콘 매핑 - 더 큰 아이콘과 향상된 색상
  const getStatIcon = (statKey: string, size: string = 'w-5 h-5') => {
    // 세계관별로 다른 아이콘 처리
    if (currentWorld.id === 'dark_finance') {
      const darkFinanceIcons: { [key: string]: { icon: JSX.Element; color: string } } = {
        capital: { icon: <Coins className={`${size} mr-2`} />, color: 'text-green-400' },
        information: { icon: <Brain className={`${size} mr-2`} />, color: 'text-blue-400' },
        network: { icon: <Users className={`${size} mr-2`} />, color: 'text-purple-400' },
        technical: { icon: <Cpu className={`${size} mr-2`} />, color: 'text-cyan-400' },
        psychology: { icon: <Activity className={`${size} mr-2`} />, color: 'text-pink-400' },
        reputation: { icon: <Crown className={`${size} mr-2`} />, color: 'text-yellow-400' },
      };
      return darkFinanceIcons[statKey] || { icon: <Shield className={`${size} mr-2`} />, color: 'text-gray-400' };
    }

    const iconMap: { [key: string]: { icon: JSX.Element; color: string } } = {
      // 판타지 세계관 능력치
      health: { icon: <Heart className={`${size} mr-2`} />, color: 'text-red-400' },
      mana: { icon: <Zap className={`${size} mr-2`} />, color: 'text-blue-400' },
      strength: { icon: <Sword className={`${size} mr-2`} />, color: 'text-red-500' },
      intelligence: { icon: <Brain className={`${size} mr-2`} />, color: 'text-blue-500' },
      dexterity: { icon: <Zap className={`${size} mr-2`} />, color: 'text-yellow-400' },
      constitution: { icon: <Shield className={`${size} mr-2`} />, color: 'text-green-400' },
      
      // 사이버펑크 세계관 능력치
      body: { icon: <Activity className={`${size} mr-2`} />, color: 'text-red-400' },
      neural: { icon: <Cpu className={`${size} mr-2`} />, color: 'text-blue-400' },
      reflex: { icon: <Target className={`${size} mr-2`} />, color: 'text-yellow-400' },
      technical: { icon: <Wrench className={`${size} mr-2`} />, color: 'text-green-400' },
      cool: { icon: <ThermometerSun className={`${size} mr-2`} />, color: 'text-purple-400' },
      reputation: { icon: <Star className={`${size} mr-2`} />, color: 'text-orange-400' },
    };
    
    return iconMap[statKey] || { icon: <Shield className={`${size} mr-2`} />, color: 'text-gray-400' };
  };

  // 아이템 아이콘 매핑 함수
  const getItemIcon = (itemName: string) => {
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

  // 아이템 타입을 한글로 변환
  const getItemType = (item: any) => {
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

  // 스킬 타입을 한글로 변환
  const getSkillType = (skill: any) => {
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

  // 스킬 아이콘 매핑
  const getSkillIcon = (skill: any) => {
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

  // 캐릭터의 능력치 값 가져오기
  const getStatValue = (statKey: string): number => {
    const characterStats: { [key: string]: any } = character;
    
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
        'capital': 'gold', // 자본 -> 골드로 매핑
        'information': 'intelligence', // 정보력 -> 지능으로 매핑
        'network': 'dexterity', // 인맥 -> 민첩으로 매핑
        'technical': 'constitution', // 기술력 -> 체질으로 매핑
        'psychology': 'strength', // 심리전 -> 힘으로 매핑
        'reputation': 'experience' // 명성도 -> 경험치로 매핑
      };
      
      const mappedKey = mappingTable[statKey] || statKey;
      return characterStats[mappedKey] || 0;
    }
    
    return characterStats[statKey] || 0;
  };

  // 주요 능력치인지 판단
  const isPrimaryResource = (statKey: string): boolean => {
    return ['health', 'mana', 'body', 'neural'].includes(statKey);
  };

  // 능력치 분리
  const primaryStats = Object.keys(statNames).filter(isPrimaryResource);
  const secondaryStats = Object.keys(statNames).filter(key => !isPrimaryResource(key));

  // 레벨 진행도 계산
  const expToNextLevel = character.level * 100;
  const expProgress = (character.experience / expToNextLevel) * 100;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden">
      
      {/* 컴팩트한 캐릭터 헤더 */}
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
          
          {/* 경험치 바 - 오른쪽에 세로로 */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-purple-300 mb-1">EXP</span>
            <div className="w-4 h-16 bg-slate-700/80 rounded-full overflow-hidden rotate-180">
              <div 
                className="bg-gradient-to-t from-purple-500 to-blue-500 w-full transition-all duration-1000 ease-out"
                style={{ height: `${Math.max(2, expProgress)}%` }}
              ></div>
            </div>
            <span className="text-xs text-white font-bold mt-1">{Math.round(expProgress)}%</span>
          </div>
        </div>
      </div>

      {/* 간소화된 탭 네비게이션 */}
      <div className="flex bg-slate-800/50 border-b border-slate-600/50">
        {[
          { id: 'overview', label: '전체', icon: Activity },
          { id: 'stats', label: '능력치', icon: TrendingUp },
          { id: 'inventory', label: '소지품', icon: Package },
          { id: 'advanced', label: '시스템', icon: Brain }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center px-2 py-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 컴팩트한 탭 컨텐츠 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        
        {/* 전체 개요 탭 - 좌우 공간 최대 활용 */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {/* 주요 리소스 - 가로 2열 */}
            <div className="grid grid-cols-2 gap-3">
              {primaryStats.map((statKey) => {
                const currentValue = getStatValue(statKey);
                let maxValue = currentValue;
                
                if (currentWorld.id === 'cyberpunk_2187') {
                  if (statKey === 'body') maxValue = character.maxHealth || currentValue;
                  else if (statKey === 'neural') maxValue = character.maxMana || currentValue;
                } else {
                  const maxKey = `max${statKey.charAt(0).toUpperCase() + statKey.slice(1)}`;
                  maxValue = (character as any)[maxKey] || currentValue;
                }
                
                const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
                const statInfo = getStatIcon(statKey, 'w-5 h-5');
                
                const getBarColor = (key: string) => {
                  if (['health', 'body'].includes(key)) return 'from-red-500 to-red-400';
                  if (['mana', 'neural'].includes(key)) return 'from-blue-500 to-blue-400';
                  return 'from-green-500 to-green-400';
                };

                return (
                  <div key={statKey} className="bg-slate-700/80 rounded-lg p-3 border border-slate-600/50 hover:bg-slate-600/80 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`flex items-center ${statInfo.color}`}>
                        {statInfo.icon}
                        <span className="font-bold text-sm">{statNames[statKey]}</span>
                      </div>
                      <span className="text-lg font-bold text-white">
                        {currentValue}<span className="text-gray-400 text-xs">/{maxValue}</span>
                      </span>
                    </div>
                    
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r ${getBarColor(statKey)} h-2 rounded-full transition-all duration-500 relative`}
                        style={{ width: `${Math.max(2, percentage)}%` }}
                      >
                        {percentage < 30 && (
                          <div className="absolute inset-0 animate-pulse bg-red-500/30 rounded-full"></div>
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
              })}
            </div>

            {/* 골드와 주요 아이템 - 가로 배치 */}
            <div className="grid grid-cols-3 gap-3">
              {/* 골드 */}
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

              {/* 스킬 미리보기 */}
              <div className="bg-slate-700/80 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-center text-purple-400 mb-2">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-xs font-bold">스킬</span>
                </div>
                <div className="text-lg font-bold text-white">{character.skills?.length || 0}</div>
                <div className="text-xs text-gray-400">보유 중</div>
              </div>

              {/* 아이템 미리보기 */}
              <div className="bg-slate-700/80 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center text-green-400 mb-2">
                  <Package className="w-4 h-4 mr-1" />
                  <span className="text-xs font-bold">아이템</span>
                </div>
                <div className="text-lg font-bold text-white">{character.inventory?.length || 0}</div>
                <div className="text-xs text-gray-400">보유 중</div>
              </div>
            </div>

            {/* 보조 능력치 - 가로 4열 */}
            <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                능력치
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {secondaryStats.map((statKey) => {
                  const statValue = getStatValue(statKey);
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
                })}
              </div>
            </div>
          </div>
        )}

        {/* 능력치 상세 탭 */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(statNames).map((statKey) => {
              const statValue = getStatValue(statKey);
              const statInfo = getStatIcon(statKey);

              return (
                <div key={statKey} className="bg-slate-700/80 rounded-lg p-3 border border-slate-600/50 hover:bg-slate-600/80 transition-colors">
                  <div className={`flex items-center ${statInfo.color} mb-2`}>
                    {statInfo.icon}
                    <span className="font-bold text-sm">{statNames[statKey]}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{statValue}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

                 {/* 인벤토리 탭 - 개선된 아이템과 스킬 표시 */}
         {activeTab === 'inventory' && (
           <div className="space-y-4">
             {/* 스킬 섹션 */}
             <div className="bg-slate-700/50 rounded-lg p-3 border border-purple-500/30">
               <h4 className="font-bold text-purple-300 mb-3 flex items-center">
                 <Star className="w-4 h-4 mr-2" />
                 보유 스킬 ({character.skills?.length || 0}개)
               </h4>
               <div className="grid grid-cols-1 gap-2">
                 {character.skills && character.skills.length > 0 ? (
                   character.skills.map((skill, index) => (
                     <div 
                       key={skill.id || index} 
                       className="bg-slate-600/50 rounded-lg p-3 border border-purple-500/20 hover:bg-slate-500/50 transition-colors group"
                       title={skill.name || skill}
                     >
                       <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-3 flex-1 min-w-0">
                           <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                             <span className="text-lg">{getSkillIcon(skill)}</span>
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="font-medium text-purple-300 text-sm group-hover:text-purple-200 transition-colors">
                               {skill.name || skill}
                             </div>
                             <div className="text-xs text-purple-400 font-medium">
                               {getSkillType(skill)}
                             </div>
                             {skill.description && (
                               <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                 {skill.description}
                               </div>
                             )}
                           </div>
                         </div>
                         {typeof skill === 'object' && skill.manaCost > 0 && (
                           <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-2 py-1">
                             <div className="text-blue-400 font-bold text-sm">{skill.manaCost}</div>
                             <div className="text-blue-300 text-xs">MP</div>
                           </div>
                         )}
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center text-gray-400 py-6">
                     <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-500/20">
                       <Star className="w-8 h-8 opacity-50 text-purple-400" />
                     </div>
                     <div className="text-sm font-medium">보유한 스킬이 없습니다</div>
                     <div className="text-xs text-gray-500">스킬을 습득하여 능력을 강화하세요</div>
                   </div>
                 )}
               </div>
             </div>

             {/* 아이템 섹션 - 개선된 아이템 정보 */}
             <div className="bg-slate-700/50 rounded-lg p-3 border border-green-500/30">
               <h4 className="font-bold text-green-300 mb-3 flex items-center">
                 <Package className="w-4 h-4 mr-2" />
                 보유 아이템 ({character.inventory?.length || 0}개)
               </h4>
               <div className="grid grid-cols-1 gap-2">
                 {character.inventory && character.inventory.length > 0 ? (
                   character.inventory.map((item, index) => (
                     <div 
                       key={item.id || index} 
                       className="bg-slate-600/50 rounded-lg p-3 border border-green-500/20 hover:bg-slate-500/50 transition-colors group"
                       title={item.name}
                     >
                       <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                           <span className="text-lg">{getItemIcon(item.name)}</span>
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="font-medium text-green-300 text-sm group-hover:text-green-200 transition-colors">
                             {item.name}
                           </div>
                           <div className="flex items-center space-x-2 mt-1">
                             <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                               {getItemType(item)}
                             </span>
                             {item.rarity && (
                               <span className={`text-xs font-medium px-2 py-1 rounded ${
                                 item.rarity === 'legendary' ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' :
                                 item.rarity === 'epic' ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20' :
                                 item.rarity === 'rare' ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' :
                                 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                               }`}>
                                 {item.rarity === 'legendary' ? '전설' :
                                  item.rarity === 'epic' ? '영웅' :
                                  item.rarity === 'rare' ? '희귀' : '일반'}
                               </span>
                             )}
                           </div>
                           {item.description && (
                             <div className="text-xs text-gray-400 mt-2 leading-relaxed">
                               {item.description}
                             </div>
                           )}
                           {item.stats && (
                             <div className="flex flex-wrap gap-1 mt-2">
                               {Object.entries(item.stats).map(([stat, value]) => (
                                 <span key={stat} className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                   {stat} +{value}
                                 </span>
                               ))}
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center text-gray-400 py-6">
                     <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/20">
                       <Package className="w-8 h-8 opacity-50 text-green-400" />
                     </div>
                     <div className="text-sm font-medium">보유한 아이템이 없습니다</div>
                     <div className="text-xs text-gray-500">모험을 통해 아이템을 수집하세요</div>
                   </div>
                 )}
               </div>
             </div>
           </div>
         )}

        {/* 고급 시스템 탭 */}
        {activeTab === 'advanced' && (
          <AdvancedSystemsDashboard character={character} />
        )}
      </div>
    </div>
  );
};

export default CharacterStats;