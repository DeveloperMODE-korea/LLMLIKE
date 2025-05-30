import React from 'react';
import { StoryEvent } from '../types/game';
import { ArrowLeft } from 'lucide-react';

interface GameControlsProps {
  currentEvent?: StoryEvent;
  onChoiceSelected: (choiceId: number) => void;
  isLoading: boolean;
  onReturnToMenu: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentEvent,
  onChoiceSelected,
  isLoading,
  onReturnToMenu,
}) => {
  if (!currentEvent || isLoading) {
    return (
      <div className="mt-4 flex justify-between">
        <button
          onClick={onReturnToMenu}
          className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          메뉴로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-2">
        <h3 className="text-xl text-yellow-400 mb-3">어떻게 하시겠습니까?</h3>
        <div className="space-y-2">
          {currentEvent.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoiceSelected(choice.id)}
              className="w-full bg-slate-700 hover:bg-slate-600 border border-purple-800 rounded-lg p-3 text-left text-gray-200 transition-all duration-200 hover:translate-x-1"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={onReturnToMenu}
          className="flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          메뉴로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default GameControls;