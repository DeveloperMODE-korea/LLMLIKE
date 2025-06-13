// crypto.randomUUID() 사용으로 uuid 패키지 불필요
import { Character, Job, GameState, StoryEvent, Choice, Enemy } from '../types/game';
import { JOB_DETAILS } from '../data/jobs';
// 더 이상 mockStories 사용하지 않음 - 세계관별 fallback 사용
import { apiService } from '../services/apiService';
import { advancedSystemsService } from '../services/advancedSystemsService';
import { authService } from '../services/authService';

// 세계관별 fallback 스토리를 위한 간단한 구조체
interface WorldFallbackStory {
  content: string;
  choices: Array<{ id: number; text: string; }>;
}

const WORLD_FALLBACK_STORIES: Record<string, WorldFallbackStory> = {
  'dimensional_rift': {
    content: `차원의 균열이 열린 고대 유적 앞에서 당신은 이상한 에너지의 파동을 느낍니다. 공기가 일렁이며 현실이 왜곡되는 것이 보입니다. 균열 너머로 다른 차원의 모습이 희미하게 비춰지고, 그곳에서 무언가가 이쪽을 바라보고 있는 것 같습니다.`,
    choices: [
      { id: 1, text: "차원의 균열을 조사한다" },
      { id: 2, text: "차원술로 균열을 안정화시킨다" },
      { id: 3, text: "균열 너머의 존재와 소통을 시도한다" },
      { id: 4, text: "일단 안전한 거리를 둔다" }
    ]
  },
  'cyberpunk_2187': {
    content: `네온 불빛이 어둠을 가르는 네오 시티의 가장자리, 당신은 아라사카 기업의 버려진 창고 근처에 서 있습니다. 차가운 금속 냄새와 번개 같은 전자기 신호가 공기를 진동시킵니다. 당신의 레조넌스 능력이 주변의 숨겨진 디지털 신호를 감지하기 시작합니다.`,
    choices: [
      { id: 1, text: "창고 내부로 조용히 은밀하게 들어간다" },
      { id: 2, text: "주변을 먼저 정찰한다" },
      { id: 3, text: "레조넌스 능력으로 주변 디지털 신호를 분석한다" },
      { id: 4, text: "다른 경로를 찾아본다" }
    ]
  },
  'classic_fantasy': {
    content: `어두운 돌방에서 깨어난 당신은 고대의 먼지 냄새가 가득한 공기를 맡습니다. 머리가 지끈거리며 기억이 희미하게 떠오릅니다. 앞에는 낡은 나무문이 있고, 깜빡이는 횃불이 벽에 그림자를 드리우고 있습니다.`,
    choices: [
      { id: 1, text: "방을 자세히 살펴본다" },
      { id: 2, text: "자신의 상태와 소지품을 확인한다" },
      { id: 3, text: "문으로 다가가 열어본다" },
      { id: 4, text: "주변의 소리에 귀를 기울인다" }
    ]
  }
};

// 실시간 게스트 모드 확인 함수
const isGuestMode = (): boolean => {
  // localStorage의 guestMode 플래그와 실제 인증 토큰 상태를 모두 확인
  const guestFlag = localStorage.getItem('guestMode') === 'true';
  const hasToken = !!authService.getToken();
  
  // 토큰이 있으면 로그인 상태이므로 게스트 모드가 아님
  if (hasToken) {
    // 토큰이 있는데 게스트 플래그가 남아있다면 제거
    if (guestFlag) {
      localStorage.removeItem('guestMode');
      console.log('🧹 토큰 발견! 남아있던 게스트 모드 플래그 제거됨');
    }
    return false;
  }
  
  return guestFlag;
};

export const createCharacter = (name: string, job: Job): Character => {
  const jobDetails = JOB_DETAILS[job];
  
  return {
    id: crypto.randomUUID(),
    name,
    job,
    level: 1,
    health: jobDetails.startingStats.health,
    maxHealth: jobDetails.startingStats.health,
    mana: jobDetails.startingStats.mana,
    maxMana: jobDetails.startingStats.mana,
    strength: jobDetails.startingStats.strength,
    intelligence: jobDetails.startingStats.intelligence,
    dexterity: jobDetails.startingStats.dexterity,
    constitution: jobDetails.startingStats.constitution,
    inventory: [],
    gold: 10,
    experience: 0,
    skills: [...jobDetails.startingSkills],
  };
};

// 실제 Claude API를 사용한 스토리 생성
export const generateNextStory = async (
  gameState: GameState, 
  choiceId?: number
): Promise<{storyEvent: StoryEvent, updatedCharacter?: Character}> => {
  try {
    // 선택한 텍스트 찾기
    let userChoice: string | undefined;
    if (choiceId !== undefined && gameState.currentEvent) {
      const selectedChoice = gameState.currentEvent.choices.find(choice => choice.id === choiceId);
      userChoice = selectedChoice?.text;
    }

    // 고급 시스템 데이터 가져오기
    let advancedSystemsData = null;
    try {
      advancedSystemsData = await advancedSystemsService.getCharacterData(gameState.character.id);
    } catch (error) {
      console.warn('고급 시스템 데이터 로딩 실패:', error);
    }

    // 백엔드 API로 스토리 생성 요청 (고급 시스템 데이터 포함)
    const response = await apiService.generateStory({
      characterId: gameState.character.id,
      userChoice,
      // 고급 시스템 컨텍스트 추가
      characterMemories: advancedSystemsData?.memories || [],
      npcRelationships: advancedSystemsData?.relationships || [],
      factionReputations: advancedSystemsData?.reputations || [],
      activeSideQuests: advancedSystemsData?.sideQuests?.filter((q: any) => q.status !== 'completed') || [],
      gameContext: {
        currentStage: gameState.currentStage,
        storyHistory: gameState.storyHistory.slice(-3), // 최근 3개 이벤트만
        worldId: gameState.worldId
      }
    });

    console.log('📨 스토리 생성 응답:', response);

    // 응답 데이터를 StoryEvent 형태로 변환
    const storyEvent: StoryEvent = {
      id: response.storyEvent.id,
      stageNumber: response.storyEvent.stageNumber,
      content: response.storyEvent.content,
      choices: response.storyEvent.choices.map((choice: any) => ({
        id: choice.id,
        text: choice.text,
        consequence: choice.consequence
      })),
      type: response.storyEvent.type,
      enemyId: response.storyEvent.enemyId,
      selectedChoice: response.storyEvent.selectedChoice
    };

    // 캐릭터 상태가 업데이트된 경우 반환
    let updatedCharacter: Character | undefined;
    if (response.character) {
      updatedCharacter = {
        id: response.character.id,
        name: response.character.name,
        job: response.character.job,
        level: response.character.level,
        health: response.character.health,
        maxHealth: response.character.maxHealth,
        mana: response.character.mana,
        maxMana: response.character.maxMana,
        strength: response.character.strength,
        intelligence: response.character.intelligence,
        dexterity: response.character.dexterity,
        constitution: response.character.constitution,
        inventory: response.character.inventory || [],
        gold: response.character.gold,
        experience: response.character.experience,
        skills: response.character.skills || []
      };
      
      console.log('🔄 캐릭터 상태 업데이트됨:', {
        health: `${updatedCharacter.health}/${updatedCharacter.maxHealth}`,
        mana: `${updatedCharacter.mana}/${updatedCharacter.maxMana}`,
        gold: updatedCharacter.gold,
        experience: updatedCharacter.experience
      });
    }

    return { storyEvent, updatedCharacter };
    
  } catch (error) {
    console.error('스토리 생성 오류:', error);
    
    // 오류 발생 시 기본 스토리로 폴백
    console.log('API 오류로 인해 기본 스토리를 사용합니다.');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentStage = gameState.currentStage;
        const worldId = gameState.worldId || 'classic_fantasy';
        
        // 세계관별 fallback 스토리 선택
        const fallbackStory = WORLD_FALLBACK_STORIES[worldId] || WORLD_FALLBACK_STORIES['classic_fantasy'];
        
        const nextEvent: StoryEvent = {
          id: crypto.randomUUID(),
          stageNumber: currentStage + 1,
          content: fallbackStory.content,
          choices: fallbackStory.choices,
          type: '이야기'
        };
        
        resolve({ storyEvent: nextEvent });
      }, 1000);
    });
  }
};

export const getEnemy = (enemyId: string): Enemy | undefined => {
  // TODO: 실제 적 데이터베이스 연동 필요
  // 현재는 mock 적 제거로 인해 undefined 반환
  console.warn('getEnemy: 적 데이터가 구현되지 않음. enemyId:', enemyId);
  return undefined;
};

export const processChoice = async (
  gameState: GameState, 
  choiceId: number
): Promise<GameState> => {
  // 게스트 모드 스테이지 제한 확인
  if (isGuestMode() && gameState.currentStage >= 10) {
    // 10스테이지 제한 도달 - 특별한 이벤트 반환
    const limitReachedEvent: StoryEvent = {
      id: 'guest-limit-reached',
      stageNumber: gameState.currentStage + 1,
      content: `🎮 **게스트 체험이 종료되었습니다!**\n\n축하합니다! 게스트 모드로 10스테이지까지 체험해보셨습니다.\n\n더 깊이 있는 모험을 계속하고 싶다면 회원가입을 통해 무제한으로 게임을 즐겨보세요!\n\n✨ **회원 혜택:**\n• 무제한 스테이지 진행\n• 더 정교한 AI 스토리텔링\n• 게임 진행 상황 자동 저장\n• 고급 캐릭터 커스터마이징\n• 특별한 아이템과 스킬`,
      choices: [
        { id: 1, text: "회원가입하고 모험 계속하기" },
        { id: 2, text: "게스트 모드 재시작" }
      ],
      type: 'guestLimit'
    };

    return {
      ...gameState,
      currentEvent: limitReachedEvent,
      waitingForApi: false,
    };
  }

  const updatedHistory = [...gameState.storyHistory];
  
  if (gameState.currentEvent) {
    const updatedEvent = {
      ...gameState.currentEvent,
      selectedChoice: choiceId,
    };
    
    updatedHistory.push(updatedEvent);
  }
  
  // Get the next story based on the choice
  const result = await generateNextStory(gameState, choiceId);
  
  return {
    ...gameState,
    character: result.updatedCharacter || gameState.character,
    storyHistory: updatedHistory,
    currentStage: gameState.currentStage + 1,
    currentEvent: result.storyEvent,
    waitingForApi: false,
  };
};

export const processCombatAction = (
  gameState: GameState,
  choiceId: number
): GameState => {
  if (!gameState.currentEvent || gameState.currentEvent.type !== '전투' || !gameState.currentEvent.enemyId) {
    return gameState;
  }
  
  const enemy = getEnemy(gameState.currentEvent.enemyId);
  if (!enemy) return gameState;
  
  let combatResult = '';
  let updatedCharacter = { ...gameState.character };
  
  // Simple combat resolution
  switch (choiceId) {
    case 1: // Attack
      const damage = Math.floor(updatedCharacter.strength * 1.5);
      combatResult = `You attack the ${enemy.name} for ${damage} damage!`;
      
      if (damage >= enemy.health) {
        combatResult += ` The ${enemy.name} is defeated!`;
        updatedCharacter.experience += enemy.experience;
        updatedCharacter.gold += enemy.gold || 0;
        
        // Level up if enough experience
        if (updatedCharacter.experience >= updatedCharacter.level * 100) {
          updatedCharacter.level += 1;
          updatedCharacter.maxHealth += 10;
          updatedCharacter.health = updatedCharacter.maxHealth;
          updatedCharacter.maxMana += 5;
          updatedCharacter.mana = updatedCharacter.maxMana;
          updatedCharacter.strength += 1;
          updatedCharacter.intelligence += 1;
          updatedCharacter.dexterity += 1;
          updatedCharacter.constitution += 1;
          
          combatResult += ` You've leveled up to level ${updatedCharacter.level}!`;
        }
      } else {
        const enemyDamage = Math.max(1, enemy.damage - Math.floor(updatedCharacter.constitution / 4));
        updatedCharacter.health = Math.max(0, updatedCharacter.health - enemyDamage);
        
        combatResult += ` The ${enemy.name} strikes back for ${enemyDamage} damage.`;
        
        if (updatedCharacter.health <= 0) {
          combatResult += ` You have been defeated!`;
        }
      }
      break;
      
    case 2: // Dodge
      const dodgeChance = 0.5 + (updatedCharacter.dexterity / 20);
      if (Math.random() < dodgeChance) {
        combatResult = `You successfully dodge the ${enemy.name}'s attack and counter for ${Math.floor(updatedCharacter.dexterity * 0.8)} damage!`;
      } else {
        const enemyDamage = Math.max(1, enemy.damage - Math.floor(updatedCharacter.constitution / 4));
        updatedCharacter.health = Math.max(0, updatedCharacter.health - enemyDamage);
        
        combatResult = `You attempt to dodge but fail! The ${enemy.name} hits you for ${enemyDamage} damage.`;
      }
      break;
      
    case 3: // Reason
      combatResult = `You try to reason with the ${enemy.name}, but it seems incapable of understanding. It attacks!`;
      const enemyDamage = Math.max(1, enemy.damage - Math.floor(updatedCharacter.constitution / 4));
      updatedCharacter.health = Math.max(0, updatedCharacter.health - enemyDamage);
      combatResult += ` You take ${enemyDamage} damage.`;
      break;
      
    case 4: // Use environment
      const intelligenceCheck = Math.random() < (updatedCharacter.intelligence / 20);
      if (intelligenceCheck) {
        combatResult = `You cleverly use your surroundings to gain an advantage! You knock over a loose stone pillar onto the ${enemy.name}, dealing significant damage!`;
      } else {
        combatResult = `You look around frantically but find nothing useful. The ${enemy.name} takes advantage of your distraction!`;
        const enemyDamage = Math.max(1, enemy.damage - Math.floor(updatedCharacter.constitution / 4));
        updatedCharacter.health = Math.max(0, updatedCharacter.health - enemyDamage);
        combatResult += ` You take ${enemyDamage} damage.`;
      }
      break;
  }
  
  // Update the current event with the combat result
  const updatedEvent = {
    ...gameState.currentEvent,
    result: combatResult,
  };
  
  return {
    ...gameState,
    character: updatedCharacter,
    currentEvent: updatedEvent,
  };
};

export const saveGameState = async (gameState: GameState): Promise<void> => {
  // 게스트 모드에서는 저장하지 않음
  if (isGuestMode()) {
    console.log('🚫 게스트 모드에서는 게임이 저장되지 않습니다.');
    return;
  }

  try {
    // 데이터베이스에 저장
    await apiService.saveGameState({
      characterId: gameState.character.id,
      gameState: {
        currentStage: gameState.currentStage,
        gameStatus: 'playing',
        waitingForApi: gameState.waitingForApi,
        worldId: gameState.worldId || 'dimensional_rift'
      }
    });

    console.log('🎮 게임 저장됨 (데이터베이스):', {
      character: gameState.character.name,
      level: gameState.character.level,
      stage: gameState.currentStage,
      worldId: gameState.worldId
    });
  } catch (error) {
    console.error('❌ 게임 저장 실패:', error);
    
    // 실패 시 localStorage로 폴백
    console.log('📁 로컬 저장소로 폴백합니다...');
    localStorage.setItem('llmlike-gamestate', JSON.stringify(gameState));
  }
};

export const loadGameState = async (characterId?: string): Promise<GameState | null> => {
  // 게스트 모드에서는 로드하지 않음
  if (isGuestMode()) {
    console.log('🚫 게스트 모드에서는 게임이 로드되지 않습니다.');
    return null;
  }

  if (!characterId) {
    // characterId가 없으면 localStorage에서 시도
    const saved = localStorage.getItem('llmlike-gamestate');
    if (saved) {
      const gameState = JSON.parse(saved);
      console.log('🎮 게임 로드됨 (로컬):', {
        character: gameState.character?.name,
        level: gameState.character?.level,
        stage: gameState.currentStage,
        worldId: gameState.worldId
      });
      return gameState;
    }
    return null;
  }

  try {
    // 데이터베이스에서 로드
    const gameState = await apiService.loadGameState(characterId);
    
    if (gameState) {
      console.log('🎮 게임 로드됨 (데이터베이스):', {
        character: gameState.character?.name,
        level: gameState.character?.level,
        stage: gameState.currentStage,
        worldId: gameState.worldId
      });
      return gameState;
    }
  } catch (error) {
    console.error('❌ 게임 로드 실패:', error);
    
    // 실패 시 localStorage에서 폴백
    console.log('📁 로컬 저장소에서 폴백 시도...');
    const saved = localStorage.getItem('llmlike-gamestate');
    if (saved) {
      const gameState = JSON.parse(saved);
      console.log('🎮 게임 로드됨 (로컬 폴백):', {
        character: gameState.character?.name,
        level: gameState.character?.level,
        stage: gameState.currentStage,
        worldId: gameState.worldId
      });
      return gameState;
    }
  }
  
  return null;
};