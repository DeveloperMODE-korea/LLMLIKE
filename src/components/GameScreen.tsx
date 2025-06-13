import React from 'react';
import { GameState } from '../types/game';
import { GameLayout } from './GameScreen/GameLayout';
import { GameMainPanel } from './GameScreen/GameMainPanel';
import CharacterStats from './CharacterStats';
import { GuestLimitModal } from './Auth/GuestLimitModal';

// Import microservice hooks
import { useGameLogic, useGameTimer, useGuestMode, useAutoSave } from '../hooks';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
}

/**
 * Refactored GameScreen using microservice hooks architecture
 * Now cleanly separated with single responsibility components and hooks
 */
const GameScreen: React.FC<GameScreenProps> = ({ gameState, setGameState }) => {
  // Microservice hooks - each handling specific concerns
  const { isLoading, handleStoryChoice, handleCombatChoice } = useGameLogic();
  const waitTime = useGameTimer();
  const { showGuestLimitModal, handleSignUpRedirect, handleGuestRestart } = useGuestMode();
  const { canAutoSave } = useAutoSave();

  const handleChoice = (choiceId: number) => {
    if (gameState.currentEvent?.type === '전투') {
      handleCombatChoice(choiceId);
    } else {
      handleStoryChoice(choiceId);
    }
  };

  const returnToMainMenu = () => {
    setGameState(null);
  };

  return (
    <GameLayout
      leftPanel={
        <CharacterStats character={gameState.character} />
      }
      rightPanel={
        <GameMainPanel
          currentEvent={gameState.currentEvent}
          isLoading={isLoading || gameState.waitingForApi}
          waitTime={waitTime}
          stage={gameState.currentStage}
          onChoiceSelected={handleChoice}
          onReturnToMenu={returnToMainMenu}
        />
      }
      modal={
        <GuestLimitModal
          isOpen={showGuestLimitModal}
          onSignUp={handleSignUpRedirect}
          onRestart={handleGuestRestart}
        />
      }
    />
  );
};

export default GameScreen;