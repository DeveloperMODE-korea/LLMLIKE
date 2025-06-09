import { v4 as uuidv4 } from 'uuid';
import { Character, Job, GameState, StoryEvent, Choice, Enemy } from '../types/game';
import { JOB_DETAILS } from '../data/jobs';
import { MOCK_STORIES, MOCK_ENEMIES } from '../data/mockStories';
import { apiService } from '../services/apiService';

export const createCharacter = (name: string, job: Job): Character => {
  const jobDetails = JOB_DETAILS[job];
  
  return {
    id: uuidv4(),
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

    // 백엔드 API로 스토리 생성 요청
    const response = await apiService.generateStory({
      characterId: gameState.character.id,
      userChoice
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
        let nextEvent: StoryEvent;
        
        if (currentStage === 0) {
          nextEvent = { ...MOCK_STORIES[0] };
        } else {
          const nextIndex = Math.min(currentStage, MOCK_STORIES.length - 1);
          nextEvent = { ...MOCK_STORIES[nextIndex] };
        }
        
        nextEvent.stageNumber = currentStage + 1;
        nextEvent.id = uuidv4();
        
        resolve({ storyEvent: nextEvent });
      }, 1000);
    });
  }
};

export const getEnemy = (enemyId: string): Enemy | undefined => {
  return MOCK_ENEMIES[enemyId as keyof typeof MOCK_ENEMIES] as Enemy;
};

export const processChoice = async (
  gameState: GameState, 
  choiceId: number
): Promise<GameState> => {
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

export const saveGameState = (gameState: GameState): void => {
  localStorage.setItem('llmlike-gamestate', JSON.stringify(gameState));
  console.log('🎮 게임 저장됨:', {
    character: gameState.character.name,
    level: gameState.character.level,
    stage: gameState.currentStage,
    worldId: gameState.worldId
  });
};

export const loadGameState = (): GameState | null => {
  const saved = localStorage.getItem('llmlike-gamestate');
  if (saved) {
    const gameState = JSON.parse(saved);
    console.log('🎮 게임 로드됨:', {
      character: gameState.character?.name,
      level: gameState.character?.level,
      stage: gameState.currentStage,
      worldId: gameState.worldId
    });
    return gameState;
  }
  return null;
};