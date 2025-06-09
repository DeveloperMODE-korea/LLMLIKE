import React, { useEffect, useState } from 'react';
import { StoryEvent } from '../types/game';
import { Hourglass, Sparkles, Scroll, Swords, Coins, ShoppingCart, Tent } from 'lucide-react';

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
      const typingSpeed = 15;
      
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
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        {/* 애니메이션 로딩 효과 */}
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          {waitTime 
            ? `이야기 생성 중... (${waitTime}초)` 
            : '선택 처리 중...'}
        </h3>
          <p className="text-gray-300 max-w-md leading-relaxed">
            고대의 AI가 당신의 운명을 엮어가고 있습니다. 
            <br />잠시만 기다려주세요...
        </p>
          
          {/* 진행 바 효과 */}
          {waitTime && (
            <div className="w-full bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: `${Math.max(10, (45 - waitTime) / 45 * 100)}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-8 border border-slate-500/30 backdrop-blur-sm">
          <Scroll className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-float" />
          <p className="text-xl text-gray-300">모험이 곧 시작됩니다...</p>
        </div>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    const iconMap: { [key: string]: { icon: JSX.Element; color: string } } = {
      '전투': { icon: <Swords className="w-5 h-5" />, color: 'from-red-600 to-red-400' },
      '보물': { icon: <Coins className="w-5 h-5" />, color: 'from-yellow-600 to-yellow-400' },
      '상점': { icon: <ShoppingCart className="w-5 h-5" />, color: 'from-green-600 to-green-400' },
      '휴식': { icon: <Tent className="w-5 h-5" />, color: 'from-blue-600 to-blue-400' },
    };
    
    return iconMap[type] || { icon: <Scroll className="w-5 h-5" />, color: 'from-purple-600 to-purple-400' };
  };

  const eventInfo = getEventIcon(currentEvent.type);

  return (
    <div className="h-full flex flex-col p-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div className={`bg-gradient-to-r ${eventInfo.color} text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center space-x-2 transform hover:scale-105 transition-transform`}>
          {eventInfo.icon}
          <span>{currentEvent.type}</span>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
          <span className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>스테이지 {stage}</span>
          </span>
        </div>
      </div>
      
      {/* 메인 스토리 컨텐츠 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-500/30 rounded-xl p-6 mb-4 relative shadow-xl">
          {/* 장식적 요소 */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-tl-xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-br-xl"></div>
          
          {/* 스토리 텍스트 */}
          <div className="prose prose-invert max-w-none relative z-10">
            <div className="text-gray-100 leading-relaxed text-lg">
          {displayedText}
              {isTyping && (
                <span className="inline-block w-3 h-6 bg-purple-400 ml-1 animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
        
        {/* 결과 메시지 */}
        {currentEvent.result && (
          <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 shadow-lg animate-fadeIn">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 animate-pulse"></div>
              <div className="text-red-200 leading-relaxed">
                {currentEvent.result}
              </div>
      </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default StoryView;