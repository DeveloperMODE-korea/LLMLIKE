import React from 'react';
import { CharacterMemory } from '../../types/shared';
import { Brain, MapPin, Calendar } from 'lucide-react';

interface MemoryPanelProps {
  memories: CharacterMemory[];
  isLoading?: boolean;
}

/**
 * Memory panel component for displaying character memories
 * Separated from AdvancedSystemsDashboard for better maintainability
 */
export const MemoryPanel: React.FC<MemoryPanelProps> = React.memo(({ 
  memories, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-2 text-gray-300">기억 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-purple-300">캐릭터 기억</h3>
        <span className="text-sm text-gray-400">{memories.length}개의 기록</span>
      </div>
      
      {memories.length === 0 ? (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-500">아직 기록된 기억이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      )}
    </div>
  );
});

MemoryPanel.displayName = 'MemoryPanel';

/**
 * Individual memory card component
 */
const MemoryCard: React.FC<{ memory: CharacterMemory }> = React.memo(({ memory }) => {
  const getImportanceStyle = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-900 text-red-300';
      case 'major':
        return 'bg-orange-900 text-orange-300';
      case 'moderate':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700/80 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-white">{memory.title}</h4>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs ${getImportanceStyle(memory.importance)}`}>
            {memory.importance}
          </span>
          <span className="text-xs text-gray-500 bg-slate-700 px-2 py-1 rounded">
            {memory.eventType}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-2 leading-relaxed">{memory.description}</p>
      
      {memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {memory.tags.map((tag, index) => (
            <span key={index} className="bg-slate-700 text-xs px-2 py-1 rounded text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {memory.location && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{memory.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(memory.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        {memory.npcInvolved && memory.npcInvolved.length > 0 && (
          <span className="text-purple-400">
            관련 NPC: {memory.npcInvolved.join(', ')}
          </span>
        )}
      </div>
    </div>
  );
});

MemoryCard.displayName = 'MemoryCard'; 