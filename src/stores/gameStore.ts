import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState, Character, StoryEvent } from '../types/shared';

// Game store state interface
interface GameStoreState {
  // Core game state
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  
  // Admin mode state
  isAdminMode: boolean;
  
  // Actions
  setGameState: (gameState: GameState | null) => void;
  updateCharacter: (character: Partial<Character>) => void;
  addStoryEvent: (event: StoryEvent) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAdminMode: (isAdmin: boolean) => void;
  resetGame: () => void;
  
  // Selectors (computed values)
  getCurrentStage: () => number;
  isGameActive: () => boolean;
  getCurrentEvent: () => StoryEvent | undefined;
}

// Initial state
const initialState = {
  gameState: null,
  isLoading: false,
  error: null,
  isAdminMode: false,
};

// Create the store with persistence
export const useGameStore = create<GameStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Core actions
        setGameState: (gameState) => 
          set({ gameState, error: null }, false, 'setGameState'),
          
        updateCharacter: (characterUpdate) => 
          set(
            (state) => {
              if (!state.gameState) return state;
              return {
                gameState: {
                  ...state.gameState,
                  character: {
                    ...state.gameState.character,
                    ...characterUpdate,
                  },
                },
              };
            },
            false,
            'updateCharacter'
          ),
          
        addStoryEvent: (event) =>
          set(
            (state) => {
              if (!state.gameState) return state;
              return {
                gameState: {
                  ...state.gameState,
                  storyHistory: [...state.gameState.storyHistory, event],
                  currentEvent: event,
                  currentStage: event.stageNumber,
                },
              };
            },
            false,
            'addStoryEvent'
          ),
          
        setLoading: (isLoading) => 
          set({ isLoading }, false, 'setLoading'),
          
        setError: (error) => 
          set({ error }, false, 'setError'),
          
        setAdminMode: (isAdminMode) => 
          set({ isAdminMode }, false, 'setAdminMode'),
          
        resetGame: () => 
          set({ gameState: null, error: null }, false, 'resetGame'),
          
        // Selectors
        getCurrentStage: () => {
          const state = get();
          return state.gameState?.currentStage ?? 0;
        },
        
        isGameActive: () => {
          const state = get();
          return state.gameState?.gameStatus === 'playing';
        },
        
        getCurrentEvent: () => {
          const state = get();
          return state.gameState?.currentEvent;
        },
      }),
      {
        name: 'llmlike-game-storage',
        partialize: (state) => ({ 
          gameState: state.gameState,
          isAdminMode: state.isAdminMode 
        }),
      }
    ),
    {
      name: 'GameStore',
    }
  )
);

// Selector hooks for specific parts of the state
export const useGameState = () => useGameStore((state) => state.gameState);
export const useCharacter = () => useGameStore((state) => state.gameState?.character);
export const useCurrentStage = () => useGameStore((state) => state.getCurrentStage());
export const useGameLoading = () => useGameStore((state) => state.isLoading);
export const useGameError = () => useGameStore((state) => state.error);
export const useAdminMode = () => useGameStore((state) => state.isAdminMode);

// Action hooks
export const useGameActions = () => {
  const store = useGameStore();
  return {
    setGameState: store.setGameState,
    updateCharacter: store.updateCharacter,
    addStoryEvent: store.addStoryEvent,
    setLoading: store.setLoading,
    setError: store.setError,
    setAdminMode: store.setAdminMode,
    resetGame: store.resetGame,
  };
}; 