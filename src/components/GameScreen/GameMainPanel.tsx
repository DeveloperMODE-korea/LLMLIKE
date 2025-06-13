import React from 'react';
import StoryView from '../StoryView';
import GameControls from '../GameControls';
import { StoryEvent } from '../../types/game';

interface GameMainPanelProps {
  currentEvent?: StoryEvent;
  isLoading: boolean;
  waitTime: number | null;
  stage: number;
  onChoiceSelected: (choiceId: number) => void;
  onReturnToMenu: () => void;
}

/**
 * Main game panel presentational component
 * Contains story view and game controls without game logic
 */
export const GameMainPanel: React.FC<GameMainPanelProps> = ({
  currentEvent,
  isLoading,
  waitTime,
  stage,
  onChoiceSelected,
  onReturnToMenu
}) => {
  return (
    <>
      {/* Story area */}
      <div className="flex-1 p-4 pb-2">
        <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-slate-500/30 rounded-xl h-full shadow-inner">
          <StoryView 
            currentEvent={currentEvent} 
            isLoading={isLoading} 
            waitTime={waitTime}
            stage={stage} 
          />
        </div>
      </div>
  
      {/* Game controls */}
      <div className="p-4 pt-0">
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-500/30 rounded-xl shadow-lg">
          <GameControls 
            currentEvent={currentEvent}
            onChoiceSelected={onChoiceSelected}
            isLoading={isLoading}
            onReturnToMenu={onReturnToMenu}
          />
        </div>
      </div>
    </>
  );
}; 