import React, { lazy, Suspense } from 'react';
import { Character } from '../../types/game';
import { Brain } from 'lucide-react';

// Lazy load the AdvancedSystemsDashboard
const AdvancedSystemsDashboard = lazy(() => import('../AdvancedSystemsDashboard'));

interface AdvancedTabProps {
  character: Character;
}

/**
 * Advanced systems tab component (lazy loaded)
 */
export const AdvancedTab: React.FC<AdvancedTabProps> = React.memo(({ character }) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 animate-pulse" />
          <div className="text-sm">고급 시스템 로딩 중...</div>
        </div>
      </div>
    }>
      <AdvancedSystemsDashboard character={character} />
    </Suspense>
  );
});

AdvancedTab.displayName = 'AdvancedTab'; 