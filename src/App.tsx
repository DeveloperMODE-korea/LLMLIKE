import React, { useState, useEffect } from 'react';
import { GameState } from './types/game';
import { AdminUser } from './types/admin';
import StartScreen from './components/StartScreen';
import CharacterCreation from './components/CharacterCreation';
import GameScreen from './components/GameScreen';
import AdminDashboard from './components/admin/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { UserProfile } from './components/Auth/UserProfile';
import { loadGameState } from './utils/gameUtils';
import WorldManager, { WorldSettingId } from './data/worldSettings';
import { Shield, Settings } from 'lucide-react';

function GameApp() {
  const { user, isLoading } = useAuth();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // 게스트 모드 확인
  const isGuestMode = localStorage.getItem('guestMode') === 'true';

  // 인증이 진행 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-animated text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">로딩 중...</h2>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우 인증 페이지 또는 게스트 모드 선택 화면 표시
  if (!user) {
    return <AuthPage />;
  }

  // 자동으로 게임을 불러오지 않고, 사용자가 직접 선택하도록 변경
  // useEffect(() => {
  //   const savedState = loadGameState();
  //   if (savedState) {
  //     setGameState(savedState);
  //   }
  // }, []);

  return (
    <div className="min-h-screen bg-animated text-gray-100 flex flex-col">
      {/* 개선된 헤더 */}
      <header className="relative bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between p-4">
            
            {/* 로고 및 타이틀 */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold neon-text">
                  LLM<span className="text-yellow-400 text-glow">LIKE</span>
                </h1>
                <p className="text-purple-200 text-sm font-medium">AI가 만드는 텍스트 로그라이크 어드벤처</p>
              </div>
              
              {/* 세계관 표시 */}
              {gameState?.worldId && (
                <div className="glass-effect px-4 py-2 rounded-xl border border-purple-500/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-200 font-medium text-sm">
                      🌍 {WorldManager.getCurrentWorld().name}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* 관리자 버튼 */}
            <div className="flex items-center space-x-3">
              {!isAdminMode ? (
                <button
                  onClick={() => {
                    const password = prompt('관리자 비밀번호를 입력하세요:');
                    if (password === 'admin123') {
                      setAdminUser({
                        id: '1',
                        username: 'admin',
                        email: 'admin@rpg.com',
                        role: 'super_admin',
                        permissions: [],
                        lastLogin: new Date(),
                        isActive: true
                      });
                      setIsAdminMode(true);
                    } else if (password !== null) {
                      alert('잘못된 비밀번호입니다.');
                    }
                  }}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-500 hover:to-purple-600 px-4 py-2 rounded-xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  title="관리자 모드"
                >
                  <Shield className="w-4 h-4 group-hover:animate-pulse" />
                  <span className="font-medium">관리자</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAdminMode(false);
                    setAdminUser(null);
                  }}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  title="게임 모드로 돌아가기"
                >
                  <Settings className="w-4 h-4 group-hover:animate-spin" />
                  <span className="font-medium">게임 모드</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* 하단 그라디언트 라인 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-60"></div>
      </header>

      <main className="flex-grow">
        {isAdminMode && adminUser ? (
          <AdminDashboard 
            adminUser={adminUser} 
            onLogout={() => {
              setIsAdminMode(false);
              setAdminUser(null);
            }}
          />
        ) : (
          <div className="flex items-center justify-center p-4 h-full">
            <div className="container mx-auto max-w-4xl">
              <UserProfile />
              {!gameState && (
                <StartScreen onStartNew={(worldId = 'dimensional_rift') => {
                  // 선택된 세계관 설정
                  WorldManager.setCurrentWorld(worldId);
                  
                  setGameState({ 
                    character: { id: '', name: '', job: undefined as any, level: 0, health: 0, maxHealth: 0, mana: 0, maxMana: 0, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, inventory: [], gold: 0, experience: 0, skills: [] },
                    currentStage: 0,
                    storyHistory: [],
                    gameStatus: 'creating',
                    waitingForApi: false,
                    worldId: worldId
                  });
                }} 
                onContinue={() => {
                  const savedState = loadGameState();
                  if (savedState) {
                    // 저장된 게임의 세계관 복원
                    if (savedState.worldId) {
                      WorldManager.setCurrentWorld(savedState.worldId);
                    }
                    setGameState(savedState);
                  }
                }}
                hasSavedGame={!isGuestMode && Boolean(loadGameState())}
                />
              )}

              {gameState?.gameStatus === 'creating' && (
                <CharacterCreation 
                  onCharacterCreated={(updatedGameState) => setGameState(updatedGameState)}
                />
              )}

              {gameState?.gameStatus === 'playing' && (
                <GameScreen 
                  gameState={gameState} 
                  setGameState={setGameState}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="relative bg-slate-900/90 backdrop-blur-xl border-t border-purple-500/30 shadow-2xl mt-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5"></div>
        
        <div className="container mx-auto relative z-10 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* 저작권 정보 */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300 font-medium">
                © 2025 <span className="text-purple-400 font-bold">LLMLIKE</span>
              </p>
              <p className="text-sm text-gray-400">
                Claude API 기반 텍스트 로그라이크 어드벤처
              </p>
            </div>
            
            {/* 상태 표시 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">AI 서비스 운영 중</span>
              </div>
              
              {gameState && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">게임 진행 중</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 상단 그라디언트 라인 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-60"></div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameApp />
    </AuthProvider>
  );
}

export default App;