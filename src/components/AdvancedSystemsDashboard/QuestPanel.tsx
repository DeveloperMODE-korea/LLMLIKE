import React from 'react';
import { SideQuest, QuestSummary } from '../../types/shared';
import { Target, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface QuestPanelProps {
  quests: SideQuest[];
  questSummary?: QuestSummary | null;
  isLoading?: boolean;
}

/**
 * Quest panel component for displaying side quests
 * Separated from AdvancedSystemsDashboard for better maintainability
 */
export const QuestPanel: React.FC<QuestPanelProps> = React.memo(({ 
  quests, 
  questSummary,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        <span className="ml-2 text-gray-300">퀘스트 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-yellow-300">사이드 퀘스트</h3>
        <span className="text-sm text-gray-400">{quests.length}개 퀘스트</span>
      </div>

      {/* Quest summary */}
      {questSummary && (
        <div className="bg-slate-800 rounded-lg p-3 border border-yellow-500/20">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2">퀘스트 현황</h4>
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div className="text-center">
              <div className="text-green-400 font-bold">{questSummary.activeCount}</div>
              <div className="text-gray-400">진행중</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">{questSummary.completedCount}</div>
              <div className="text-gray-400">완료</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-bold">{questSummary.failedCount}</div>
              <div className="text-gray-400">실패</div>
            </div>
          </div>
          
          {questSummary.recommendations.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-yellow-300 mb-1">추천사항:</h5>
              <ul className="text-xs text-yellow-400 space-y-1">
                {questSummary.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {quests.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-500">아직 수락한 퀘스트가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}
    </div>
  );
});

QuestPanel.displayName = 'QuestPanel';

/**
 * Individual quest card component
 */
const QuestCard: React.FC<{ quest: SideQuest }> = React.memo(({ quest }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'active':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'extreme':
        return 'text-red-400 bg-red-900/30 border-red-500/30';
      case 'hard':
        return 'text-orange-400 bg-orange-900/30 border-orange-500/30';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
      default:
        return 'text-green-400 bg-green-900/30 border-green-500/30';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-300 bg-green-900/30 border-green-500/30';
      case 'failed':
        return 'text-red-300 bg-red-900/30 border-red-500/30';
      case 'active':
        return 'text-yellow-300 bg-yellow-900/30 border-yellow-500/30';
      default:
        return 'text-gray-300 bg-gray-700/30 border-gray-500/30';
    }
  };

  const isTimeSensitive = quest.timeLimit && new Date(quest.timeLimit) > new Date();

  return (
    <div className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700/80 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start space-x-2">
          {getStatusIcon(quest.status)}
          <div className="flex-1">
            <h4 className="font-semibold text-white">{quest.title}</h4>
            <p className="text-sm text-gray-400 mt-1">{quest.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(quest.status)}`}>
            {quest.status}
          </span>
          <span className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty}
          </span>
        </div>
      </div>

      {/* Quest metadata */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <div className="flex items-center space-x-3">
          <span className="capitalize">📁 {quest.type}</span>
          {quest.location && (
            <span>📍 {quest.location}</span>
          )}
        </div>
        {isTimeSensitive && (
          <div className="flex items-center text-red-400">
            <Calendar className="w-3 h-3 mr-1" />
            <span>마감: {new Date(quest.timeLimit!).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Objectives */}
      {quest.objectives && quest.objectives.length > 0 && (
        <div className="mb-2">
          <h5 className="text-xs font-semibold text-yellow-300 mb-1">목표:</h5>
          <div className="space-y-1">
            {quest.objectives.map((objective) => (
              <ObjectiveItem key={objective.id} objective={objective} />
            ))}
          </div>
        </div>
      )}

      {/* Rewards */}
      {quest.rewards && quest.rewards.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-green-300 mb-1">보상:</h5>
          <div className="flex flex-wrap gap-1">
            {quest.rewards.map((reward, index) => (
              <RewardBadge key={index} reward={reward} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

QuestCard.displayName = 'QuestCard';

/**
 * Individual objective item component
 */
const ObjectiveItem: React.FC<{ objective: any }> = React.memo(({ objective }) => {
  const progress = objective.quantity 
    ? (objective.currentProgress || 0) / objective.quantity * 100
    : objective.isCompleted ? 100 : 0;

  return (
    <div className={`flex items-center text-xs ${objective.isCompleted ? 'text-green-400' : 'text-gray-300'}`}>
      <div className={`w-3 h-3 rounded mr-2 flex-shrink-0 ${
        objective.isCompleted ? 'bg-green-500' : 'bg-gray-600'
      }`}>
        {objective.isCompleted && (
          <CheckCircle className="w-3 h-3 text-white" />
        )}
      </div>
      <span className="flex-1">{objective.description}</span>
      {objective.quantity && (
        <span className="ml-2 text-gray-500">
          ({objective.currentProgress || 0}/{objective.quantity})
        </span>
      )}
    </div>
  );
});

ObjectiveItem.displayName = 'ObjectiveItem';

/**
 * Reward badge component
 */
const RewardBadge: React.FC<{ reward: any }> = React.memo(({ reward }) => {
  const getRewardIcon = (type: string): string => {
    switch (type) {
      case 'gold': return '💰';
      case 'experience': return '⭐';
      case 'item': return '🎁';
      case 'reputation': return '🏆';
      default: return '✨';
    }
  };

  return (
    <span className="bg-slate-700 text-xs px-2 py-1 rounded text-gray-300 flex items-center">
      <span className="mr-1">{getRewardIcon(reward.type)}</span>
      {reward.description}
      {reward.amount && <span className="ml-1">({reward.amount})</span>}
    </span>
  );
});

RewardBadge.displayName = 'RewardBadge'; 