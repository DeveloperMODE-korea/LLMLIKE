import React, { useState, useEffect } from 'react';
import { GameState } from './types/game';
import StartScreen from './components/StartScreen';
import CharacterCreation from './components/CharacterCreation';
import GameScreen from './components/GameScreen';
import { loadGameState } from './utils/gameUtils';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
      <header className="p-4 bg-slate-800 border-b border-purple-900">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center text-purple-300">
            LLM<span className="text-yellow-400">LIKE</span>
          </h1>
          <p className="text-center text-purple-200 text-sm">AI가 만드는 텍스트 로그라이크 어드벤처</p>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="container mx-auto max-w-4xl">
          {!gameState && (
            <StartScreen onStartNew={() => setGameState({ 
              character: { id: '', name: '', job: undefined as any, level: 0, health: 0, maxHealth: 0, mana: 0, maxMana: 0, strength: 0, intelligence: 0, dexterity: 0, constitution: 0, inventory: [], gold: 0, experience: 0, skills: [] },
              currentStage: 0,
              storyHistory: [],
              gameStatus: 'creating',
              waitingForApi: false
            })} 
            onContinue={() => {
              const savedState = loadGameState();
              if (savedState) {
                setGameState(savedState);
              }
            }}
            hasSavedGame={Boolean(loadGameState())}
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
      </main>

      <footer className="p-4 bg-slate-800 border-t border-purple-900 text-center text-sm text-gray-400">
        <p>© 2025 LLMLIKE - Claude API 기반 텍스트 로그라이크 어드벤처</p>
      </footer>
    </div>
  );
}

export default App;