import { useEffect, useCallback } from 'react';
import { useGameState } from '../stores/gameStore';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

/**
 * Auto-save hook for persisting game state
 * Automatically saves game progress at regular intervals
 */
export const useAutoSave = () => {
  const gameState = useGameState();
  const { user } = useAuth();

  const saveGame = useCallback(async () => {
    if (!gameState || !user || user.id === 'guest') return;

    try {
      await apiService.saveGameState({
        characterId: gameState.character.id,
        gameState: {
          currentStage: gameState.currentStage,
          gameStatus: gameState.gameStatus,
          waitingForApi: gameState.waitingForApi,
          worldId: gameState.worldId
        }
      });
      console.log('🎮 게임 자동 저장 완료');
    } catch (error) {
      console.error('❌ 자동 저장 실패:', error);
    }
  }, [gameState, user]);

  // Auto-save every 30 seconds for non-guest users
  useEffect(() => {
    if (!gameState || !user || user.id === 'guest') return;

    const interval = setInterval(saveGame, 30000); // 30초마다
    return () => clearInterval(interval);
  }, [gameState, user, saveGame]);

  // Save on game state changes (debounced)
  useEffect(() => {
    if (!gameState || !user || user.id === 'guest') return;

    const timeout = setTimeout(saveGame, 5000); // 5초 후 저장
    return () => clearTimeout(timeout);
  }, [gameState?.currentStage, gameState?.gameStatus, saveGame]);

  return {
    saveGame,
    canAutoSave: !!(gameState && user && user.id !== 'guest')
  };
}; 