import React, { useState } from 'react';
import { Job, GameState } from '../types/game';
import { JOB_DETAILS } from '../data/jobs';
import { createCharacter, generateNextStory } from '../utils/gameUtils';
import { apiService } from '../services/apiService';
import { Swords, Wand, Flame, Cross } from 'lucide-react';

interface CharacterCreationProps {
  onCharacterCreated: (gameState: GameState) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreated }) => {
  const [name, setName] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const jobIcons = {
    [Job.WARRIOR]: <Swords className="w-8 h-8 text-red-400" />,
    [Job.MAGE]: <Wand className="w-8 h-8 text-blue-400" />,
    [Job.ROGUE]: <Flame className="w-8 h-8 text-yellow-400" />,
    [Job.CLERIC]: <Cross className="w-8 h-8 text-green-400" />
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (!name.trim()) {
        setNameError('캐릭터 이름을 입력해주세요');
        return;
      }
      setNameError('');
      setStep(2);
    } else if (step === 2 && selectedJob) {
      setIsLoading(true);
      
      try {
        // 백엔드에 캐릭터 생성 요청
        console.log('백엔드에 캐릭터 생성 요청 중...');
        const jobDetails = JOB_DETAILS[selectedJob];
        
        const characterData = {
          name,
          job: selectedJob,
          stats: {
            health: jobDetails.startingStats.health,
            mana: jobDetails.startingStats.mana,
            strength: jobDetails.startingStats.strength,
            intelligence: jobDetails.startingStats.intelligence,
            dexterity: jobDetails.startingStats.dexterity,
            constitution: jobDetails.startingStats.constitution,
          }
        };

        const backendResponse = await apiService.createCharacter(characterData);
        console.log('백엔드에서 캐릭터 생성 완료:', backendResponse);
        console.log('📋 백엔드 응답 구조 세부사항:');
        console.log('  - 응답에 success 속성이 있는가?:', 'success' in backendResponse);
        console.log('  - 응답에 data 속성이 있는가?:', 'data' in backendResponse);
        console.log('  - 응답에 character 속성이 있는가?:', 'character' in backendResponse);
        console.log('  - 캐릭터 ID (direct):', backendResponse.character?.id);
        console.log('  - 캐릭터 ID (data):', backendResponse.data?.character?.id);
        console.log('  - 전체 백엔드 응답:', JSON.stringify(backendResponse, null, 2));
        
        // 백엔드에서 받은 캐릭터 데이터로 로컬 캐릭터 생성
        // API 서비스에서 이미 data를 추출했으므로 직접 접근
        const backendCharacter = backendResponse.character;
        if (!backendCharacter || !backendCharacter.id) {
          throw new Error('백엔드에서 올바른 캐릭터 데이터를 받지 못했습니다.');
        }
        
        const character = {
          id: backendCharacter.id,
          name: backendCharacter.name,
          job: backendCharacter.job,
          level: backendCharacter.level,
          health: backendCharacter.health,
          maxHealth: backendCharacter.maxHealth,
          mana: backendCharacter.mana,
          maxMana: backendCharacter.maxMana,
          strength: backendCharacter.strength,
          intelligence: backendCharacter.intelligence,
          dexterity: backendCharacter.dexterity,
          constitution: backendCharacter.constitution,
          inventory: backendCharacter.items || [],
          gold: backendCharacter.gold,
          experience: backendCharacter.experience,
          skills: backendCharacter.skills || jobDetails.startingSkills,
        };
        
        console.log('🎭 로컬 캐릭터 생성 결과:');
        console.log('  - 캐릭터 ID:', character.id);
        console.log('  - 캐릭터 이름:', character.name);
        console.log('  - ID 타입:', typeof character.id);
        console.log('  - 전체 캐릭터:', JSON.stringify(character, null, 2));
        
        const initialGameState: GameState = {
          character,
          currentStage: 0,
          storyHistory: [],
          gameStatus: 'playing',
          waitingForApi: true
        };
        
        console.log('🎮 게임 상태 생성 결과:');
        console.log('  - gameState.character.id:', initialGameState.character.id);
        console.log('  - ID가 존재하는가?', !!initialGameState.character.id);
        
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
    <div className="bg-slate-800 border border-purple-700 rounded-lg p-6 shadow-lg max-w-3xl mx-auto animate-fadeIn">
      <h2 className="text-3xl text-center font-bold mb-6 text-purple-300">캐릭터 생성</h2>
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.values(Job).map((job) => (
              <div
                key={job}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedJob === job
                    ? 'bg-purple-900 border-purple-400'
                    : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => handleSelectJob(job)}
              >
                <div className="flex items-center mb-2">
                  {jobIcons[job]}
                  <h4 className="text-lg font-bold ml-2">{job}</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">{JOB_DETAILS[job].description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>체력: {JOB_DETAILS[job].startingStats.health}</div>
                  <div>마나: {JOB_DETAILS[job].startingStats.mana}</div>
                  <div>힘: {JOB_DETAILS[job].startingStats.strength}</div>
                  <div>지능: {JOB_DETAILS[job].startingStats.intelligence}</div>
                  <div>민첩: {JOB_DETAILS[job].startingStats.dexterity}</div>
                  <div>체질: {JOB_DETAILS[job].startingStats.constitution}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleBackStep}
              className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-200 w-1/2"
            >
              이전
            </button>
            <button
              onClick={handleNextStep}
              disabled={!selectedJob || isLoading}
              className={`${
                !selectedJob || isLoading
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