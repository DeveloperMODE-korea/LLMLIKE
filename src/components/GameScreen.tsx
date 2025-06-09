import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { processChoice, processCombatAction, saveGameState, generateNextStory, getEnemy } from '../utils/gameUtils';
import CharacterStats from './CharacterStats';
import StoryView from './StoryView';
import GameControls from './GameControls';
import { GuestLimitModal } from './Auth/GuestLimitModal';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, setGameState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);

  // 게스트 제한 이벤트 확인
  useEffect(() => {
    if (gameState.currentEvent?.type === 'guestLimit') {
      setShowGuestLimitModal(true);
    }
  }, [gameState.currentEvent]);

  useEffect(() => {
    // Save the game state whenever it changes
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  // Simulate API waiting time for story generation
  useEffect(() => {
    if (gameState.waitingForApi) {
      setWaitTime(45);
      const timer = setInterval(() => {
        setWaitTime(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.waitingForApi]);

  const handleChoice = async (choiceId: number) => {
    // 게스트 제한 이벤트 처리
    if (gameState.currentEvent?.type === 'guestLimit') {
      if (choiceId === 1) {
        // 회원가입하고 모험 계속하기
        handleSignUpRedirect();
      } else if (choiceId === 2) {
        // 게스트 모드 재시작
        handleGuestRestart();
      }
      return;
    }

    setIsLoading(true);

    try {
      if (gameState.currentEvent?.type === 'combat') {
        // Handle combat choice
        const updatedGameState = processCombatAction(gameState, choiceId);
        
        // Check if combat is over
        const enemy = gameState.currentEvent.enemyId ? getEnemy(gameState.currentEvent.enemyId) : undefined;
        const isEnemyDefeated = enemy && updatedGameState.character.health > 0;
        
        if (isEnemyDefeated) {
          // Move to next stage after combat
          setGameState({
            ...updatedGameState,
            waitingForApi: true,
          });
          
          const nextEvent = await generateNextStory(updatedGameState);
          
          setGameState(prev => {
            if (prev) {
              return {
                ...prev,
                currentEvent: nextEvent,
                currentStage: prev.currentStage + 1,
                waitingForApi: false,
              };
            }
            return prev;
          });
        } else {
          setGameState(updatedGameState);
        }
      } else {
        // Handle regular story choice
        setGameState({
          ...gameState,
          waitingForApi: true,
        });
        
        const updatedGameState = await processChoice(gameState, choiceId);
        setGameState(updatedGameState);
      }
    } catch (error) {
      console.error('Error processing choice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    // 게스트 모드 해제하고 회원가입 페이지로 이동
    localStorage.removeItem('guestMode');
    setShowGuestLimitModal(false);
    window.location.reload(); // 인증 페이지로 리다이렉트
  };

  const handleGuestRestart = () => {
    // 게스트 모드 재시작
    setShowGuestLimitModal(false);
    setGameState(null); // 메인 메뉴로 돌아가기
  };
  
  const returnToMainMenu = () => {
    setGameState(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 animate-fadeIn">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto p-4 h-screen">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/20 h-full overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* 캐릭터 정보 패널 - 왼쪽 */}
            <div className="lg:w-1/3 xl:w-2/5 h-full border-r border-purple-500/20 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
              <div className="h-full p-4">
                <CharacterStats character={gameState.character} />
              </div>
            </div>
        
            {/* 스토리 및 게임 영역 - 오른쪽 */}
            <div className="lg:w-2/3 xl:w-3/5 flex flex-col h-full">
              
              {/* 스토리 영역 */}
              <div className="flex-1 p-4 pb-2">
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border border-slate-500/30 rounded-xl h-full shadow-inner">
                  <StoryView 
                    currentEvent={gameState.currentEvent} 
                    isLoading={isLoading || gameState.waitingForApi} 
                    waitTime={waitTime}
                    stage={gameState.currentStage} 
                  />
                </div>
              </div>
          
              {/* 게임 컨트롤 */}
              <div className="p-4 pt-0">
                <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-500/30 rounded-xl shadow-lg">
                  <GameControls 
                    currentEvent={gameState.currentEvent}
                    onChoiceSelected={handleChoice}
                    isLoading={isLoading || gameState.waitingForApi}
                    onReturnToMenu={returnToMainMenu}
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* 게스트 제한 모달 */}
      <GuestLimitModal
        isOpen={showGuestLimitModal}
        onSignUp={handleSignUpRedirect}
        onRestart={handleGuestRestart}
      />
    </div>
  );
};

export default GameScreen;