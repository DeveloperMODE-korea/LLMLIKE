import React, { useState, useCallback } from 'react';
import { Character } from '../../types/game';
import { Activity, TrendingUp, Package, Brain } from 'lucide-react';
import { CharacterHeader } from './CharacterHeader';
import { PrimaryStats } from './PrimaryStats';
import { SecondaryStats } from './SecondaryStats';
import { StatsDetailTab } from './StatsDetailTab';
import { InventoryTab } from './InventoryTab';
import { AdvancedTab } from './AdvancedTab';

interface CharacterStatsProps {
  character: Character;
}

type TabId = 'overview' | 'stats' | 'inventory' | 'advanced';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: '전체', icon: Activity },
  { id: 'stats', label: '능력치', icon: TrendingUp },
  { id: 'inventory', label: '소지품', icon: Package },
  { id: 'advanced', label: '시스템', icon: Brain }
];

/**
 * Main CharacterStats container component
 * Manages tab state and renders appropriate content
 */
const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-3">
            <PrimaryStats character={character} />
            <SecondaryStats character={character} />
          </div>
        );
      case 'stats':
        return <StatsDetailTab character={character} />;
      case 'inventory':
        return <InventoryTab character={character} />;
      case 'advanced':
        return <AdvancedTab character={character} />;
      default:
        return null;
    }
  };

  const renderTab = (tab: TabConfig) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`flex-1 flex items-center justify-center px-2 py-2 transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-slate-600/50'
        }`}
      >
        <Icon className="w-4 h-4 mr-1" />
        <span className="text-xs font-medium">{tab.label}</span>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden">
      {/* Character Header */}
      <CharacterHeader character={character} />

      {/* Tab Navigation */}
      <div className="flex bg-slate-800/50 border-b border-slate-600/50">
        {TABS.map(renderTab)}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CharacterStats; 