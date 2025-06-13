import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGameState, useAdminMode, useGameActions } from '../stores/gameStore';
import { AdminUser } from '../types/admin';
import { loadGameState } from '../utils/gameUtils';
import WorldManager from '../data/worldSettings';

// Components
import StartScreen from './StartScreen';
import CharacterCreation from './CharacterCreation';
import GameScreen from './GameScreen';
import AdminDashboard from './admin/AdminDashboard';
import { AuthPage } from './Auth/AuthPage';
import { UserProfile } from './Auth/UserProfile';

interface AppRouterProps {
  adminUser: AdminUser | null;
  onAdminLogout: () => void;
}

/**
 * AppRouter handles the main application routing and view logic
 * Extracted from App.tsx for better separation of concerns
 */
export const AppRouter: React.FC<AppRouterProps> = ({
  adminUser,
  onAdminLogout
}) => {
  const { user, isLoading } = useAuth();
  const gameState = useGameState();
  const isAdminMode = useAdminMode();
  const { setGameState } = useGameActions();

  // Loading screen during authentication
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

  // Authentication page for non-authenticated users
  if (!user) {
    return <AuthPage />;
  }

  // Admin mode view
  if (isAdminMode && adminUser) {
    return (
      <AdminDashboard 
        adminUser={adminUser} 
        onLogout={onAdminLogout}
      />
    );
  }

  // Game mode views
  return (
    <div className="flex items-center justify-center p-4 h-full">
      <div className="container mx-auto max-w-4xl">
        <UserProfile />
        
        {!gameState && (
          <StartScreen 
                         onStartNew={(worldId: string = 'dimensional_rift') => {
               // Set selected world
               WorldManager.setCurrentWorld(worldId as any);
              
              setGameState({ 
                character: { 
                  id: '', 
                  name: '', 
                  job: undefined as any, 
                  level: 0, 
                  health: 0, 
                  maxHealth: 0, 
                  mana: 0, 
                  maxMana: 0, 
                  strength: 0, 
                  intelligence: 0, 
                  dexterity: 0, 
                  constitution: 0, 
                  inventory: [], 
                  gold: 0, 
                  experience: 0, 
                  skills: [] 
                },
                currentStage: 0,
                storyHistory: [],
                gameStatus: 'creating',
                waitingForApi: false,
                worldId: worldId
              });
            }} 
            onContinue={async () => {
              try {
                const savedState = await loadGameState();
                if (savedState) {
                  // Restore saved game's world
                  if (savedState.worldId) {
                    WorldManager.setCurrentWorld(savedState.worldId);
                  }
                  setGameState(savedState);
                }
              } catch (error) {
                console.error('게임 로드 실패:', error);
                alert('게임을 불러오는 중 오류가 발생했습니다.');
              }
            }}
            hasSavedGame={false} // TODO: improve with async check
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
  );
};

export default AppRouter; 