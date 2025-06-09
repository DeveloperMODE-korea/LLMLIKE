import React, { useState } from 'react';
import { Swords, BookOpen, Skull, Globe } from 'lucide-react';
import WorldSelector from './WorldSelector';
import { WorldSettingId } from '../data/worldSettings';

interface StartScreenProps {
  onStartNew: (worldId?: WorldSettingId) => void;
  onContinue: () => void;
  hasSavedGame: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartNew, onContinue, hasSavedGame }) => {
  const [selectedWorldId, setSelectedWorldId] = useState<WorldSettingId>('dimensional_rift');
  const [showWorldSelector, setShowWorldSelector] = useState(false);

  const handleStartNewGame = () => {
    onStartNew(selectedWorldId);
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-6xl font-bold text-purple-300 mb-2">
          LLM<span className="text-yellow-400">LIKE</span>
        </h2>
        <p className="text-xl text-purple-200">텍스트 기반 로그라이크 어드벤처</p>
        <div className="flex justify-center mt-4 space-x-4">
          <Swords className="text-yellow-400 w-8 h-8" />
          <BookOpen className="text-purple-300 w-8 h-8" />
          <Skull className="text-red-400 w-8 h-8" />
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-lg border border-purple-700 shadow-lg max-w-2xl w-full">
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          모든 선택이 중요하고 매 턴마다 새로운 도전이 기다리는 대모험을 시작하세요.
          고대의 AI 존재가 당신의 여정을 안내할 것입니다.
          100층의 던전을 탐험하며 잊혀진 왕국의 비밀을 밝혀낼 수 있을까요?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-700 p-4 rounded-lg border border-purple-600">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">동적 스토리</h3>
            <p className="text-sm text-gray-300">AI가 만드는 독특한 이야기를 매번 새롭게 경험하세요.</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg border border-purple-600">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">전략적 선택</h3>
            <p className="text-sm text-gray-300">당신의 결정이 운명을 결정합니다. 현명하게 선택하세요.</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg border border-purple-600">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">캐릭터 성장</h3>
            <p className="text-sm text-gray-300">레벨업하고 강력한 아이템을 찾아 능력을 발전시키세요.</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg border border-purple-600">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">영구죽음</h3>
            <p className="text-sm text-gray-300">진정한 로그라이크 - 죽으면 끝입니다. 두 번째 기회는 없습니다.</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          {/* 세계관 선택 버튼 */}
          <button
            onClick={() => setShowWorldSelector(!showWorldSelector)}
            className="bg-indigo-700 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold transition-all duration-200 flex items-center justify-center"
          >
            <Globe className="mr-2 w-5 h-5" />
            {showWorldSelector ? '세계관 선택 닫기' : '세계관 선택하기'}
          </button>

          <button
            onClick={handleStartNewGame}
            className="bg-purple-700 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-bold transition-all duration-200 flex items-center justify-center"
          >
            <Swords className="mr-2 w-5 h-5" />
            새 모험 시작
          </button>
          
          {hasSavedGame && (
            <button
              onClick={onContinue}
              className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-200 flex items-center justify-center"
            >
              <BookOpen className="mr-2 w-5 h-5" />
              여정 계속하기
            </button>
          )}
        </div>
      </div>

      {/* 세계관 선택 패널 */}
      {showWorldSelector && (
        <div className="w-full max-w-2xl animate-fadeIn">
          <WorldSelector
            onWorldSelected={(worldId) => {
              setSelectedWorldId(worldId);
              setShowWorldSelector(false);
            }}
            currentWorldId={selectedWorldId}
          />
        </div>
      )}
    </div>
  );
};

export default StartScreen;