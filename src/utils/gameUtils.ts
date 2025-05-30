import { v4 as uuidv4 } from 'uuid';
import { Character, Job, GameState, StoryEvent, Choice, Enemy } from '../types/game';
import { JOB_DETAILS } from '../data/jobs';
import { MOCK_STORIES, MOCK_ENEMIES } from '../data/mockStories';

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

// In the real implementation, this would call Claude API
export const generateNextStory = (
  gameState: GameState, 
  choiceId?: number
): Promise<StoryEvent> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const currentStage = gameState.currentStage;
      let nextEvent: StoryEvent;
      
      if (currentStage === 0) {
        // Starting the game - use the first story
        nextEvent = { ...MOCK_STORIES[0] };
      } else if (choiceId !== undefined) {
        // Based on the current story and choice, get the next story
        const currentEvent = gameState.currentEvent;
        
        if (currentEvent?.stageNumber === 1) {
          if (choiceId === 3) {
            // If they chose to open the door at stage 1, trigger combat
            nextEvent = { ...MOCK_STORIES[2] }; // Combat event
          } else if (choiceId === 1) {
            nextEvent = { ...MOCK_STORIES[1] }; // Examine room
          } else {
            nextEvent = { ...MOCK_STORIES[1] }; // Check self
          }
        } else if (currentEvent?.type === 'combat' && currentEvent.enemyId === 'skeleton_guard') {
          nextEvent = { ...MOCK_STORIES[3] }; // Treasure after combat
        } else {
          // Default progression
          const nextIndex = Math.min(currentStage, MOCK_STORIES.length - 1);
          nextEvent = { ...MOCK_STORIES[nextIndex] };
        }
      } else {
        // Default progression
        const nextIndex = Math.min(currentStage, MOCK_STORIES.length - 1);
        nextEvent = { ...MOCK_STORIES[nextIndex] };
      }
      
      // Ensure the event has the correct stage number
      nextEvent.stageNumber = currentStage + 1;
      nextEvent.id = uuidv4();
      
      resolve(nextEvent);
    }, 1000);  // Simulating API delay
  });
};

export const getEnemy = (enemyId: string): Enemy | undefined => {
  return MOCK_ENEMIES[enemyId as keyof typeof MOCK_ENEMIES];
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
  const nextEvent = await generateNextStory(gameState, choiceId);
  
  return {
    ...gameState,
    storyHistory: updatedHistory,
    currentStage: gameState.currentStage + 1,
    currentEvent: nextEvent,
    waitingForApi: false,
  };
};

export const processCombatAction = (
  gameState: GameState,
  choiceId: number
): GameState => {
  if (!gameState.currentEvent || gameState.currentEvent.type !== 'combat' || !gameState.currentEvent.enemyId) {
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
  localStorage.setItem('llm_roguelike_save', JSON.stringify(gameState));
};

export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem('llm_roguelike_save');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return null;
};