import React from 'react';
import { FactionReputation, ReputationSummary } from '../../types/shared';
import { Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ReputationPanelProps {
  reputations: FactionReputation[];
  reputationSummary?: ReputationSummary | null;
  isLoading?: boolean;
}

/**
 * Reputation panel component for displaying faction relationships
 * Separated from AdvancedSystemsDashboard for better maintainability
 */
export const ReputationPanel: React.FC<ReputationPanelProps> = React.memo(({ 
  reputations, 
  reputationSummary,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <span className="ml-2 text-gray-300">평판 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-300">세력 평판</h3>
        <span className="text-sm text-gray-400">{reputations.length}개 세력</span>
      </div>

      {/* Overall reputation summary */}
      {reputationSummary && (
        <div className="bg-slate-800 rounded-lg p-3 border border-blue-500/20">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">전체 평판</h4>
          <p className="text-xs text-gray-400 mb-2">{reputationSummary.overallStanding}</p>
          
          {reputationSummary.opportunities.length > 0 && (
            <div className="mb-2">
              <h5 className="text-xs font-semibold text-green-300 mb-1">기회:</h5>
              <ul className="text-xs text-green-400 space-y-1">
                {reputationSummary.opportunities.map((opportunity, index) => (
                  <li key={index}>• {opportunity}</li>
                ))}
              </ul>
            </div>
          )}
          
          {reputationSummary.warnings.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-red-300 mb-1">주의사항:</h5>
              <ul className="text-xs text-red-400 space-y-1">
                {reputationSummary.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {reputations.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-500">아직 알려진 세력이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reputations.map((reputation) => (
            <ReputationCard key={reputation.factionId} reputation={reputation} />
          ))}
        </div>
      )}
    </div>
  );
});

ReputationPanel.displayName = 'ReputationPanel';

/**
 * Individual reputation card component
 */
const ReputationCard: React.FC<{ reputation: FactionReputation }> = React.memo(({ reputation }) => {
  const getReputationColor = (level: string): string => {
    const colors: Record<string, string> = {
      revered: 'text-yellow-300 bg-yellow-900/30 border-yellow-500/30',
      exalted: 'text-purple-300 bg-purple-900/30 border-purple-500/30',
      honored: 'text-blue-300 bg-blue-900/30 border-blue-500/30',
      friendly: 'text-green-300 bg-green-900/30 border-green-500/30',
      neutral: 'text-gray-300 bg-gray-700/30 border-gray-500/30',
      unfriendly: 'text-orange-300 bg-orange-900/30 border-orange-500/30',
      hostile: 'text-red-300 bg-red-900/30 border-red-500/30',
      hated: 'text-red-400 bg-red-800/30 border-red-400/30',
      nemesis: 'text-red-500 bg-red-700/30 border-red-500/30'
    };
    return colors[level] || colors.neutral;
  };

  const getReputationProgress = (rep: number): number => {
    // Convert reputation (-1000 to 1000) to percentage (0 to 100)
    return Math.max(5, ((rep + 1000) / 2000) * 100);
  };

  const getProgressColor = (rep: number): string => {
    if (rep >= 200) return 'bg-green-500';
    if (rep >= 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'falling') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700/80 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-white">{reputation.factionName}</h4>
          <div className="flex items-center mt-1 space-x-2">
            <span className={`px-2 py-1 rounded text-xs border ${getReputationColor(reputation.reputationLevel)}`}>
              {reputation.standing}
            </span>
            {getTrendIcon('stable')} {/* TODO: Get trend from reputationSummary */}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{reputation.reputation}</div>
          <div className="text-xs text-gray-400">/ 1000</div>
        </div>
      </div>
      
      {/* Reputation progress bar */}
      <div className="mb-3">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(reputation.reputation)}`}
            style={{ width: `${getReputationProgress(reputation.reputation)}%` }}
          />
        </div>
      </div>
      
      {/* Benefits */}
      {reputation.benefits.length > 0 && (
        <div className="mb-2">
          <h5 className="text-xs font-semibold text-green-300 mb-1">혜택:</h5>
          <ul className="text-xs text-green-400 space-y-1">
            {reputation.benefits.map((benefit, index) => (
              <li key={index}>• {benefit}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Penalties */}
      {reputation.penalties.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-red-300 mb-1">제재:</h5>
          <ul className="text-xs text-red-400 space-y-1">
            {reputation.penalties.map((penalty, index) => (
              <li key={index}>• {penalty}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

ReputationCard.displayName = 'ReputationCard'; 