import React from 'react';
import { NPCEmotion, EmotionSummary } from '../../types/shared';
import { Heart } from 'lucide-react';

interface RelationshipPanelProps {
  emotions: NPCEmotion[];
  emotionSummary?: EmotionSummary | null;
  isLoading?: boolean;
}

/**
 * Relationship panel component for displaying NPC emotions and relationships
 * Separated from AdvancedSystemsDashboard for better maintainability
 */
export const RelationshipPanel: React.FC<RelationshipPanelProps> = React.memo(({ 
  emotions, 
  emotionSummary,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
        <span className="ml-2 text-gray-300">관계 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-red-300">NPC 관계</h3>
        <span className="text-sm text-gray-400">{emotions.length}명과 상호작용</span>
      </div>
      
      {/* Overall mood summary */}
      {emotionSummary && (
        <div className="bg-slate-800 rounded-lg p-3 border border-red-500/20">
          <h4 className="text-sm font-semibold text-red-300 mb-2">전체적인 분위기</h4>
          <p className="text-xs text-gray-400">{emotionSummary.overallMood}</p>
        </div>
      )}
      
      {emotions.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-500">아직 만난 NPC가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {emotions.map((emotion) => (
            <NPCEmotionCard key={emotion.npcId} emotion={emotion} />
          ))}
        </div>
      )}
    </div>
  );
});

RelationshipPanel.displayName = 'RelationshipPanel';

/**
 * Individual NPC emotion card component
 */
const NPCEmotionCard: React.FC<{ emotion: NPCEmotion }> = React.memo(({ emotion }) => {
  const getEmotionIcon = (emotionType: string): string => {
    const icons: Record<string, string> = {
      happiness: '😊',
      anger: '😠',
      fear: '😨',
      trust: '🤝',
      respect: '🙏',
      love: '❤️',
      hostility: '⚔️',
      curiosity: '🤔',
      neutral: '😐'
    };
    return icons[emotionType] || '😐';
  };

  const getEmotionIntensityColor = (intensity: number): string => {
    if (intensity >= 80) return 'text-red-400';
    if (intensity >= 60) return 'text-orange-400';
    if (intensity >= 40) return 'text-yellow-400';
    if (intensity >= 20) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700/80 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">
            {getEmotionIcon(emotion.dominantEmotion)}
          </span>
          <div>
            <h4 className="font-semibold text-white">{emotion.npcName}</h4>
            <p className="text-sm text-gray-400">
              {emotion.dominantEmotion}{' '}
              <span className={`font-medium ${getEmotionIntensityColor(emotion.emotionIntensity)}`}>
                (강도: {emotion.emotionIntensity})
              </span>
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(emotion.lastInteraction).toLocaleDateString()}
        </span>
      </div>
      
      {/* Emotion breakdown with bars */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {Object.entries(emotion.emotions).map(([emotionName, value]) => (
          <EmotionBar
            key={emotionName}
            name={emotionName}
            value={value}
          />
        ))}
      </div>
    </div>
  );
});

NPCEmotionCard.displayName = 'NPCEmotionCard';

/**
 * Individual emotion bar component
 */
const EmotionBar: React.FC<{ name: string; value: number }> = React.memo(({ name, value }) => {
  const getBarColor = (val: number): string => {
    if (val > 0) return 'bg-green-500';
    if (val < 0) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="flex items-center">
      <span className="w-16 text-gray-400 capitalize">{name}:</span>
      <div className="flex-1 mx-2 bg-slate-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor(value)}`}
          style={{ width: `${Math.abs(value)}%` }}
        />
      </div>
      <span className={`w-8 text-right font-medium ${
        value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-300'
      }`}>
        {value}
      </span>
    </div>
  );
});

EmotionBar.displayName = 'EmotionBar'; 