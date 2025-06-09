import React, { useState } from 'react';
import { Swords, BookOpen, Globe, Sparkles, Play, Star, Shield, Zap } from 'lucide-react';
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
  
  // 게스트 모드 확인
  const isGuestMode = localStorage.getItem('guestMode') === 'true';

  const handleStartNewGame = () => {
    onStartNew(selectedWorldId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-slate-900/30"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 w-full max-w-6xl animate-fadeIn">
        
        {/* 메인 타이틀 섹션 */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h2 className="text-8xl font-bold neon-text mb-4">
              LLM<span className="text-yellow-400 text-glow">LIKE</span>
        </h2>
            <p className="text-2xl text-purple-200 font-medium mb-6">
              텍스트 기반 로그라이크 어드벤처
            </p>
            
            {/* 아이콘 애니메이션 */}
            <div className="flex justify-center space-x-8">
              <div className="animate-float">
                <Swords className="text-yellow-400 w-12 h-12" />
              </div>
              <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                <BookOpen className="text-purple-300 w-12 h-12" />
              </div>
              <div className="animate-float" style={{ animationDelay: '1s' }}>
                <Sparkles className="text-blue-400 w-12 h-12" />
              </div>
        </div>
      </div>

          {/* 게임 설명 */}
          <div className="glass-effect rounded-2xl p-8 mb-8 max-w-4xl mx-auto border border-purple-500/30">
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
          모든 선택이 중요하고 매 턴마다 새로운 도전이 기다리는 대모험을 시작하세요.
              <br />
          고대의 AI 존재가 당신의 여정을 안내할 것입니다.
              <br />
          100층의 던전을 탐험하며 잊혀진 왕국의 비밀을 밝혀낼 수 있을까요?
        </p>

            {/* 게임 특징 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card-hover bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30">
                <div className="flex items-center mb-3">
                  <Star className="w-6 h-6 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-bold text-yellow-300">동적 스토리</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  AI가 만드는 독특한 이야기를 매번 새롭게 경험하세요. 당신의 선택에 따라 무한히 펼쳐지는 서사.
                </p>
              </div>
              
              <div className="card-hover bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-500/30">
                <div className="flex items-center mb-3">
                  <Zap className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-xl font-bold text-blue-300">전략적 선택</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  당신의 결정이 운명을 결정합니다. 현명하게 선택하고 결과를 받아들이세요.
                </p>
              </div>
              
              <div className="card-hover bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/30">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-xl font-bold text-green-300">캐릭터 성장</h3>
          </div>
                <p className="text-gray-300 leading-relaxed">
                  레벨업하고 강력한 아이템을 찾아 능력을 발전시키세요. 끝없는 성장의 재미.
                </p>
          </div>
              
              <div className="card-hover bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-500/30">
                <div className="flex items-center mb-3">
                  <Swords className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-xl font-bold text-red-300">영구죽음</h3>
          </div>
                <p className="text-gray-300 leading-relaxed">
                  진정한 로그라이크 - 죽으면 끝입니다. 두 번째 기회는 없습니다.
                </p>
          </div>
        </div>

            {/* 게임 시작 버튼들 */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              
              {/* 세계관 선택 버튼 */}
              <button
                onClick={() => setShowWorldSelector(!showWorldSelector)}
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-indigo-500/30 hover:border-indigo-400/50"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Globe className="w-6 h-6 group-hover:animate-spin" />
                  <span className="text-lg">
                    {showWorldSelector ? '세계관 선택 닫기' : '세계관 선택하기'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* 새 게임 시작 */}
          <button
                onClick={handleStartNewGame}
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-purple-500/30 hover:border-purple-400/50"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Play className="w-6 h-6 group-hover:animate-pulse" />
                  <span className="text-lg">새 모험 시작</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
              {/* 게임 계속하기 - 게스트 모드에서는 표시하지 않음 */}
              {!isGuestMode && hasSavedGame && (
                <button
                  onClick={onContinue}
                  className="group relative bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white py-4 px-8 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-slate-500/30 hover:border-slate-400/50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <BookOpen className="w-6 h-6 group-hover:animate-bounce" />
                    <span className="text-lg">여정 계속하기</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
        </div>
          </div>
        </div>

        {/* 세계관 선택 패널 */}
        {showWorldSelector && (
          <div className="w-full max-w-4xl mx-auto animate-fadeIn">
            <div className="glass-effect rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
              <WorldSelector
                onWorldSelected={(worldId) => {
                  setSelectedWorldId(worldId);
                  setShowWorldSelector(false);
                }}
                currentWorldId={selectedWorldId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartScreen;