import React, { useEffect, useState } from 'react';
import { StoryEvent } from '../types/game';
import { Hourglass } from 'lucide-react';

interface StoryViewProps {
  currentEvent?: StoryEvent;
  isLoading: boolean;
  waitTime: number | null;
  stage: number;
}

const StoryView: React.FC<StoryViewProps> = ({ currentEvent, isLoading, waitTime, stage }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (currentEvent?.content && !isLoading) {
      setIsTyping(true);
      let i = 0;
      const content = currentEvent.content;
      const typingSpeed = 20;
      
      const typingInterval = setInterval(() => {
        setDisplayedText(content.substring(0, i));
        i++;
        
        if (i > content.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(typingInterval);
    }
  }, [currentEvent, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Hourglass className="w-12 h-12 text-purple-400 animate-spin mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {waitTime 
            ? `이야기 생성 중... (${waitTime}초)` 
            : '선택 처리 중...'}
        </h3>
        <p className="text-gray-400 max-w-md">
          고대의 AI가 당신의 운명을 엮어가고 있습니다. 잠시만 기다려주세요...
        </p>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <p className="text-gray-400">모험이 곧 시작됩니다...</p>
      </div>
    );
  }

  const getEventIcon = () => {
    switch (currentEvent.type) {
      case '전투':
        return '⚔️';
      case '보물':
        return '💰';
      case '상점':
        return '🛒';
      case '휴식':
        return '🏕️';
      default:
        return '📜';
    }
  };

  return (
    <div className="space-y-4 h-[500px] overflow-y-auto p-2 story-container">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-slate-800 text-yellow-400 px-3 py-1 rounded-md text-sm font-medium inline-flex items-center">
          <span className="mr-1">{getEventIcon()}</span>
          <span>{currentEvent.type}</span>
        </div>
        <div className="bg-purple-900 text-purple-200 px-3 py-1 rounded-md text-sm font-medium">
          스테이지 {stage}
        </div>
      </div>
      
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-4 leading-relaxed relative overflow-hidden">
        <div className="prose prose-invert max-w-none">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </div>
        
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-purple-500 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-purple-500 opacity-30"></div>
      </div>
      
      {currentEvent.result && (
        <div className="bg-slate-700 border border-red-900 rounded-lg p-4 mb-4 text-red-200">
          <p className="leading-relaxed">{currentEvent.result}</p>
        </div>
      )}
    </div>
  );
};

export default StoryView;