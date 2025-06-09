import React, { useState } from 'react';
import { Globe, BookOpen, Zap, Sparkles } from 'lucide-react';
import WorldManager, { WorldSettingId } from '../data/worldSettings';

interface WorldSelectorProps {
  onWorldSelected: (worldId: WorldSettingId) => void;
  currentWorldId?: WorldSettingId;
}

const WorldSelector: React.FC<WorldSelectorProps> = ({ onWorldSelected, currentWorldId }) => {
  const [selectedWorld, setSelectedWorld] = useState<WorldSettingId>(
    currentWorldId || 'dimensional_rift'
  );

  const availableWorlds = WorldManager.getAvailableWorlds();

  const handleWorldChange = (worldId: WorldSettingId) => {
    setSelectedWorld(worldId);
    onWorldSelected(worldId);
  };

  const getWorldIcon = (worldId: WorldSettingId) => {
    switch (worldId) {
      case 'dimensional_rift':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'cyberpunk_2187':
        return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'steampunk_empire':
        return <Globe className="w-6 h-6 text-amber-400" />;
      case 'space_odyssey':
        return <BookOpen className="w-6 h-6 text-blue-400" />;
      default:
        return <Globe className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-purple-700 shadow-lg">
      <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
        <Globe className="mr-2 w-5 h-5" />
        세계관 선택
      </h3>
      
      <div className="space-y-3">
        {availableWorlds.map((world) => (
          <div
            key={world.id}
            onClick={() => handleWorldChange(world.id)}
            className={`
              p-4 rounded-lg border cursor-pointer transition-all duration-200
              ${selectedWorld === world.id
                ? 'border-purple-500 bg-purple-900/30 shadow-lg'
                : 'border-slate-600 bg-slate-700 hover:border-purple-600 hover:bg-slate-600'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              {getWorldIcon(world.id)}
              <div className="flex-1">
                <h4 className={`font-bold text-lg ${
                  selectedWorld === world.id ? 'text-purple-200' : 'text-gray-200'
                }`}>
                  {world.name}
                </h4>
                <p className={`text-sm mt-1 ${
                  selectedWorld === world.id ? 'text-purple-300' : 'text-gray-400'
                }`}>
                  {world.description}
                </p>
              </div>
              {selectedWorld === world.id && (
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 미리보기 정보 */}
      {selectedWorld && (
        <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <h4 className="text-purple-300 font-bold mb-2">🎭 세계관 미리보기</h4>
          <div className="text-sm text-gray-300">
            {(() => {
              const currentWorld = WorldManager.getCurrentWorld();
              if (selectedWorld === currentWorld.id) {
                return (
                  <div className="space-y-2">
                    <p><strong>장르:</strong> {currentWorld.genre}</p>
                    <p><strong>지역 수:</strong> {currentWorld.regions.length}개</p>
                    <p><strong>스토리 아크:</strong> {currentWorld.storyArcs.length}개</p>
                    <p><strong>특별 시스템:</strong> {currentWorld.gameSystems.length}개</p>
                  </div>
                );
              } else {
                return <p className="text-gray-500">구현 예정인 세계관입니다.</p>;
              }
            })()}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 각 세계관마다 독특한 스토리텔링과 게임 시스템을 제공합니다
      </div>
    </div>
  );
};

export default WorldSelector; 