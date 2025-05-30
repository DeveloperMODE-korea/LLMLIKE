import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { processChoice, processCombatAction, saveGameState, generateNextStory, getEnemy } from '../utils/gameUtils';
import CharacterStats from './CharacterStats';
import StoryView from './StoryView';
import GameControls from './GameControls';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, setGameState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [waitTime, setWaitTime] = useState<number | null>(null);

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
  
  const returnToMainMenu = () => {
    setGameState(null);
  };

  return (
    <div className="bg-slate-800 border border-purple-700 rounded-lg p-4 md:p-6 shadow-lg w-full animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Character Stats Panel */}
        <div className="md:w-1/4">
          <CharacterStats character={gameState.character} />
        </div>
        
        {/* Story Panel */}
        <div className="md:w-3/4 flex flex-col">
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 flex-grow overflow-hidden">
            <StoryView 
              currentEvent={gameState.currentEvent} 
              isLoading={isLoading || gameState.waitingForApi} 
              waitTime={waitTime}
              stage={gameState.currentStage} 
            />
          </div>
          
          {/* Game Controls */}
          <GameControls 
            currentEvent={gameState.currentEvent}
            onChoiceSelected={handleChoice}
            isLoading={isLoading || gameState.waitingForApi}
            onReturnToMenu={returnToMainMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default GameScreen;