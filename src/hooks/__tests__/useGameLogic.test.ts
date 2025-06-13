import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '../useGameLogic';
import { apiService } from '../../services/apiService';
import * as gameStore from '../../stores/gameStore';

// Mock dependencies
vi.mock('../../stores/gameStore', () => ({
  useGameState: vi.fn(),
  useGameActions: vi.fn(() => ({
    setGameState: vi.fn(),
    setLoading: vi.fn()
  })),
  useGameLoading: vi.fn(() => false)
}));

vi.mock('../../services/apiService', () => ({
  apiService: {
    generateStory: vi.fn()
  }
}));

describe('useGameLogic', () => {
  const mockGameState = {
    character: { 
      id: 'char-123', 
      name: 'Test Character',
      job: 'WARRIOR' as any,
      level: 1,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      strength: 10,
      intelligence: 10,
      dexterity: 10,
      constitution: 10,
      inventory: [],
      gold: 100,
      experience: 0,
      skills: []
    },
    currentStage: 1,
    storyHistory: [],
    gameStatus: 'playing' as const,
    waitingForApi: false,
    worldId: 'dimensional_rift'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock store implementations
    vi.mocked(gameStore.useGameState).mockReturnValue(mockGameState);
    vi.mocked(gameStore.useGameLoading).mockReturnValue(false);
    vi.mocked(gameStore.useGameActions).mockReturnValue({
      setGameState: vi.fn(),
      setLoading: vi.fn(),
      updateCharacter: vi.fn(),
      addStoryEvent: vi.fn(),
      setError: vi.fn(),
      setAdminMode: vi.fn(),
      resetGame: vi.fn()
    });
  });

  it('should handle story choice successfully', async () => {
    const mockResponse = {
      storyEvent: { id: 'story-1', content: 'Test story' },
      character: { id: 'char-123', name: 'Updated Character' },
      currentStage: 2
    };

    (apiService.generateStory as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGameLogic());

    await act(async () => {
      await result.current.handleStoryChoice(1);
    });

    expect(apiService.generateStory).toHaveBeenCalledWith({
      characterId: 'char-123',
      userChoice: '1',
      gameContext: { worldId: 'dimensional_rift' }
    });
  });

  it('should handle combat choice successfully', async () => {
    const mockResponse = {
      storyEvent: { id: 'story-2', content: 'Combat result' },
      character: { id: 'char-123', mana: 40 },
      currentStage: 2
    };

    (apiService.generateStory as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useGameLogic());

    await act(async () => {
      await result.current.handleCombatChoice(1);
    });

    expect(apiService.generateStory).toHaveBeenCalled();
  });

  it('should return correct state and functions', () => {
    const { result } = renderHook(() => useGameLogic());

    expect(result.current).toHaveProperty('gameState');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('handleStoryChoice');
    expect(result.current).toHaveProperty('handleCombatChoice');
    expect(typeof result.current.handleStoryChoice).toBe('function');
    expect(typeof result.current.handleCombatChoice).toBe('function');
  });
}); 