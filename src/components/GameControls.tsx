import React from 'react';
import { StoryEvent } from '../types/game';
import { ArrowLeft, Sparkles, Play } from 'lucide-react';

interface GameControlsProps {
  currentEvent?: StoryEvent;
  onChoiceSelected: (choiceId: string) => void;
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
      <div className="p-4">
        <div className="flex justify-between items-center">
        <button
          onClick={onReturnToMenu}
            className="group flex items-center text-sm text-gray-400 hover:text-gray-300 transition-all duration-200 hover:transform hover:translate-x-1"
        >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-bounce-left" />
          메뉴로 돌아가기
        </button>
          
          {isLoading && (
            <div className="flex items-center text-sm text-purple-400">
              <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full mr-2"></div>
              처리 중...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 선택지 섹션 */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Sparkles className="w-6 h-6 text-yellow-400 mr-3 animate-pulse" />
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            어떻게 하시겠습니까?
          </h3>
        </div>
        
        <div className="grid gap-3">
          {currentEvent.choices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => onChoiceSelected(choice.id)}
              className="group relative bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-purple-600/80 hover:to-blue-600/80 text-white p-4 rounded-xl border border-slate-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 text-left"
            >
              {/* 선택지 번호 */}
              <div className="absolute -left-3 -top-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
              
              {/* 선택지 텍스트 */}
              <div className="flex items-center justify-between">
                <span className="text-lg leading-relaxed group-hover:text-purple-100 transition-colors">
              {choice.text}
                </span>
                <Play className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              
              {/* 호버 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>
      </div>

      {/* 하단 컨트롤 */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-600/50">
        <button
          onClick={onReturnToMenu}
          className="group flex items-center text-sm text-gray-400 hover:text-red-400 transition-all duration-200 hover:transform hover:translate-x-1 bg-slate-800/50 hover:bg-red-900/30 px-4 py-2 rounded-lg border border-slate-600/50 hover:border-red-500/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-bounce-left" />
          메뉴로 돌아가기
        </button>
        
        <div className="text-xs text-gray-500">
          {currentEvent.choices.length}개의 선택지가 있습니다
        </div>
      </div>
    </div>
  );
};

export default GameControls;