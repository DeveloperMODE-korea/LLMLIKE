import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { Cpu, Activity, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { SimpleErrorFallback } from '../common/ErrorBoundary';

// Lazy load the panels for better performance
const MemoryPanel = React.lazy(() => import('./MemoryPanel').then(m => ({ default: m.MemoryPanel })));
const RelationshipPanel = React.lazy(() => import('./RelationshipPanel').then(m => ({ default: m.RelationshipPanel })));
const ReputationPanel = React.lazy(() => import('./ReputationPanel').then(m => ({ default: m.ReputationPanel })));
const QuestPanel = React.lazy(() => import('./QuestPanel').then(m => ({ default: m.QuestPanel })));

interface AdvancedSystemsDashboardProps {
  isVisible: boolean;
  onToggle: () => void;
  advancedData: any; // TODO: Type this properly based on API
}

type TabId = 'memory' | 'relationships' | 'reputation' | 'quests';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

/**
 * Refactored AdvancedSystemsDashboard - broken down from 577 LOC God component
 * Now uses modular panels with lazy loading and React.memo optimization
 */
export const AdvancedSystemsDashboard: React.FC<AdvancedSystemsDashboardProps> = React.memo(({ 
  isVisible, 
  onToggle,
  advancedData 
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('memory');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tab configuration with memoization
  const tabs: Tab[] = useMemo(() => [
    {
      id: 'memory',
      label: '기억',
      icon: Cpu,
      description: '캐릭터의 중요한 기억과 경험'
    },
    {
      id: 'relationships',
      label: '관계',
      icon: Activity,
      description: 'NPC들과의 감정적 관계'
    },
    {
      id: 'reputation',
      label: '평판',
      icon: BarChart3,
      description: '각 세력과의 평판 상태'
    },
    {
      id: 'quests',
      label: '퀘스트',
      icon: Settings,
      description: '진행 중인 사이드 퀘스트'
    }
  ], []);

  // Memoized data extraction
  const panelData = useMemo(() => ({
    memories: advancedData?.memories || [],
    emotions: advancedData?.emotions || [],
    emotionSummary: advancedData?.emotionSummary || null,
    reputations: advancedData?.reputations || [],
    reputationSummary: advancedData?.reputationSummary || null,
    quests: advancedData?.quests || [],
    questSummary: advancedData?.questSummary || null
  }), [advancedData]);

  // Optimized handlers
  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // TODO: Implement refresh logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Loading fallback component
  const LoadingFallback = React.memo(() => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      <span className="ml-2 text-gray-300">패널 로딩 중...</span>
    </div>
  ));

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-40 bg-slate-800/90 hover:bg-slate-700/90 text-white p-3 rounded-lg border border-purple-500/30 transition-all duration-200"
        title="고급 시스템 열기"
      >
        <Cpu className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
          <div>
            <h2 className="text-2xl font-bold text-purple-300">고급 시스템</h2>
            <p className="text-sm text-gray-400 mt-1">캐릭터의 상세 정보와 세계 상호작용</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onToggle}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-gray-300"
              title="닫기"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar Navigation */}
          <div className="w-56 bg-slate-800/50 border-r border-purple-500/20 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-300'
                        : 'hover:bg-slate-700/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-white'}`} />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Suspense fallback={<LoadingFallback />}>
              {activeTab === 'memory' && (
                <MemoryPanel 
                  memories={panelData.memories}
                  isLoading={isRefreshing}
                />
              )}
              
              {activeTab === 'relationships' && (
                <RelationshipPanel 
                  emotions={panelData.emotions}
                  emotionSummary={panelData.emotionSummary}
                  isLoading={isRefreshing}
                />
              )}
              
              {activeTab === 'reputation' && (
                <ReputationPanel 
                  reputations={panelData.reputations}
                  reputationSummary={panelData.reputationSummary}
                  isLoading={isRefreshing}
                />
              )}
              
              {activeTab === 'quests' && (
                <QuestPanel 
                  quests={panelData.quests}
                  questSummary={panelData.questSummary}
                  isLoading={isRefreshing}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
});

AdvancedSystemsDashboard.displayName = 'AdvancedSystemsDashboard';

export default AdvancedSystemsDashboard; 