import { useCallback } from 'react';
import { useGameState, useGameActions, useGameLoading } from '../stores/gameStore';
import { apiService } from '../services/apiService';

/**
 * Game logic hook for handling story and combat choices
 * Refactored to use Zustand store and service layer
 */
export const useGameLogic = () => {
  const gameState = useGameState();
  const { setGameState, setLoading } = useGameActions();
  const isLoading = useGameLoading();

  const handleStoryChoice = useCallback(async (choiceId: number) => {
    if (!gameState) return;
    
    setLoading(true);
    try {
      // Update game state to show waiting
      setGameState({
        ...gameState,
        waitingForApi: true,
      });
      
      // Call API service for story generation
      const response = await apiService.generateStory({
        characterId: gameState.character.id,
        userChoice: choiceId.toString(),
        gameContext: { worldId: gameState.worldId || 'dimensional_rift' }
      });
      
      // Update game state with new story
      setGameState({
        ...gameState,
        character: response.character || gameState.character,
        currentEvent: response.storyEvent,
        currentStage: response.currentStage || gameState.currentStage + 1,
        storyHistory: [...gameState.storyHistory, response.storyEvent],
        waitingForApi: false,
      });
    } catch (error) {
      console.error('Story choice error:', error);
      setGameState({
        ...gameState,
        waitingForApi: false,
      });
    } finally {
      setLoading(false);
    }
  }, [gameState, setGameState, setLoading]);

  const handleCombatChoice = useCallback(async (choiceId: number) => {
    if (!gameState?.currentEvent) return;
    
    setLoading(true);
    try {
      // For combat, we process locally first then generate next story
      const updatedCharacter = { ...gameState.character };
      
      // Apply combat effects based on choice
      switch (choiceId) {
        case 1: // Attack
          updatedCharacter.mana = Math.max(0, updatedCharacter.mana - 10);
          break;
        case 2: // Defend
          updatedCharacter.health = Math.min(updatedCharacter.maxHealth, updatedCharacter.health + 5);
          break;
        case 3: // Use skill
          updatedCharacter.mana = Math.max(0, updatedCharacter.mana - 15);
          break;
      }
      
      // Update state and generate next story
      const updatedState = {
        ...gameState,
        character: updatedCharacter,
        waitingForApi: true,
      };
      setGameState(updatedState);
      
      // Generate next story event
      const response = await apiService.generateStory({
        characterId: gameState.character.id,
        userChoice: choiceId.toString(),
        gameContext: { worldId: gameState.worldId || 'dimensional_rift' }
      });
      
      setGameState({
        ...updatedState,
        character: response.character || updatedCharacter,
        currentEvent: response.storyEvent,
        currentStage: response.currentStage || gameState.currentStage + 1,
        storyHistory: [...gameState.storyHistory, response.storyEvent],
        waitingForApi: false,
      });
    } catch (error) {
      console.error('Combat choice error:', error);
      setGameState({
        ...gameState,
        waitingForApi: false,
      });
    } finally {
      setLoading(false);
    }
  }, [gameState, setGameState, setLoading]);

  return {
    gameState,
    isLoading,
    handleStoryChoice,
    handleCombatChoice
  };
}; 