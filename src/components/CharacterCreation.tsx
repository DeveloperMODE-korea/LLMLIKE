import React, { useState } from 'react';
import { GameState } from '../types/game';
import { createCharacter, generateNextStory } from '../utils/gameUtils';
import { apiService } from '../services/apiService';
import { WorldManager } from '../data/worldSettings';
import { WorldClass } from '../data/worldSettings/types';
import { getAvatarByJobName } from '../data/avatars';

interface CharacterCreationProps {
  onCharacterCreated: (gameState: GameState) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreated }) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<WorldClass | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  // 현재 세계관 정보 가져오기
  const currentWorld = WorldManager.getCurrentWorld();
  const availableClasses = currentWorld.classes;
  const statNames = currentWorld.statNames;

  const handleSelectClass = (worldClass: WorldClass) => {
    setSelectedClass(worldClass);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!name.trim()) {
        setNameError('캐릭터 이름을 입력해주세요');
        return;
      }
      setNameError('');
      setStep(2);
    } else if (step === 2 && selectedClass) {
      setIsLoading(true);
      
      try {
        // 백엔드에 캐릭터 생성 요청
        console.log('백엔드에 캐릭터 생성 요청 중...');
        
        const characterData = {
          name,
          job: selectedClass.name,
          worldId: currentWorld.id,
          stats: selectedClass.baseStats
        };

        const backendResponse = await apiService.createCharacter(characterData);
        console.log('백엔드에서 캐릭터 생성 완료:', backendResponse);
        
        // 백엔드에서 받은 캐릭터 데이터로 로컬 캐릭터 생성
        const backendCharacter = backendResponse.character;
        if (!backendCharacter || !backendCharacter.id) {
          throw new Error('백엔드에서 올바른 캐릭터 데이터를 받지 못했습니다.');
        }
        
        const character = {
          id: backendCharacter.id,
          name: backendCharacter.name,
          job: selectedClass.name,
          level: backendCharacter.level || 1,
          health: backendCharacter.health || selectedClass.baseStats.health || selectedClass.baseStats.body || 100,
          maxHealth: backendCharacter.maxHealth || selectedClass.baseStats.health || selectedClass.baseStats.body || 100,
          mana: backendCharacter.mana || selectedClass.baseStats.mana || selectedClass.baseStats.neural || 50,
          maxMana: backendCharacter.maxMana || selectedClass.baseStats.mana || selectedClass.baseStats.neural || 50,
          strength: backendCharacter.strength || selectedClass.baseStats.strength || selectedClass.baseStats.body || 10,
          intelligence: backendCharacter.intelligence || selectedClass.baseStats.intelligence || selectedClass.baseStats.technical || 10,
          dexterity: backendCharacter.dexterity || selectedClass.baseStats.dexterity || selectedClass.baseStats.reflex || 10,
          constitution: backendCharacter.constitution || selectedClass.baseStats.constitution || selectedClass.baseStats.cool || 10,
          inventory: backendCharacter.items || [],
          gold: backendCharacter.gold || 100,
          experience: backendCharacter.experience || 0,
          skills: backendCharacter.skills || selectedClass.startingSkills,
        };
        
        const initialGameState: GameState = {
          character,
          currentStage: 0,
          storyHistory: [],
          gameStatus: 'playing',
          waitingForApi: true,
          worldId: currentWorld.id  // 선택된 세계관 ID 설정
        };
        
        console.log('첫 번째 스토리 생성 요청 중...');
        const result = await generateNextStory(initialGameState);
        console.log('첫 번째 스토리 생성 완료:', result);
        
        const updatedGameState = {
          ...initialGameState,
          character: result.updatedCharacter || initialGameState.character,
          currentEvent: result.storyEvent,
          waitingForApi: false
        };
        
        onCharacterCreated(updatedGameState);
        
      } catch (error) {
        console.error('캐릭터 생성 오류:', error);
        alert('캐릭터 생성에 실패했습니다. 서버 연결을 확인해주세요.');
        setIsLoading(false);
      }
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

  return (
    <div className="bg-slate-800 border border-purple-700 rounded-lg p-6 shadow-lg max-w-4xl mx-auto animate-fadeIn">
      <h2 className="text-3xl text-center font-bold mb-6 text-purple-300">캐릭터 생성</h2>
      <div className="text-center mb-4 text-gray-300">
        🌍 <strong>{currentWorld.name}</strong> 세계관
      </div>
      
      {step === 1 && (
        <div className="mb-6">
          <h3 className="text-xl text-yellow-400 mb-4">모험가여, 당신의 이름은 무엇입니까?</h3>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError('');
              }}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="캐릭터 이름 입력..."
            />
            {nameError && <p className="mt-2 text-red-400 text-sm">{nameError}</p>}
          </div>
          <button
            onClick={handleNextStep}
            className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-200 w-full"
          >
            다음 단계
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-xl text-yellow-400 mb-4">{name}님, 당신의 직업을 선택하세요</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {availableClasses.map((worldClass) => {
              const avatarData = getAvatarByJobName(worldClass.name, currentWorld.id);
              
              return (
              <div
                  key={worldClass.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedClass?.id === worldClass.id
                    ? 'bg-purple-900 border-purple-400'
                    : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                }`}
                  onClick={() => handleSelectClass(worldClass)}
              >
                <div className="flex items-center mb-2">
                    {/* 아바타 미리보기 */}
                    {avatarData && (
                      <div 
                        className="w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center mr-3 border border-opacity-50"
                        style={{ 
                          background: `linear-gradient(to bottom right, ${avatarData.primaryColor}80, ${avatarData.secondaryColor}80)`,
                          borderColor: avatarData.primaryColor 
                        }}
                      >
                        <span 
                          className="text-lg"
                          style={{ color: avatarData.primaryColor }}
                        >
                          {avatarData.icon}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-bold">{worldClass.name}</h4>
                      <p className="text-sm text-yellow-400">{worldClass.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{worldClass.description}</p>
                  
                  {/* 능력치 표시 */}
                  <div className="grid grid-cols-2 gap-1 text-xs mb-3">
                    {Object.entries(worldClass.baseStats).map(([statKey, value]) => (
                      <div key={statKey} className="text-gray-300">
                        {statNames[statKey] || statKey}: {value}
                      </div>
                    ))}
                  </div>
                  
                  {/* 시작 스킬 표시 */}
                  <div className="text-xs text-blue-300">
                    <strong>시작 스킬:</strong> {worldClass.startingSkills.join(', ')}
                  </div>
                </div>
              );
            })}
                </div>
          
          {/* 선택된 직업의 상세 정보 */}
          {selectedClass && (
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-bold text-purple-300 mb-2">{selectedClass.name} - 상세 정보</h4>
              <div className="text-sm text-gray-300 whitespace-pre-line">
                {selectedClass.detailedDescription}
              </div>
          </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={handleBackStep}
              className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-200 w-1/2"
            >
              이전
            </button>
            <button
              onClick={handleNextStep}
              disabled={!selectedClass || isLoading}
              className={`${
                !selectedClass || isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-purple-700 hover:bg-purple-600'
              } text-white py-2 px-6 rounded-lg font-semibold transition-all duration-200 w-1/2`}
            >
              {isLoading ? '캐릭터 생성 중...' : '모험 시작'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterCreation;