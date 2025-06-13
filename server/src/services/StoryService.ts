import { PrismaClient } from '@prisma/client';
import { ClaudeService } from './claudeService';
import { NotFoundError, ValidationError, DatabaseError, ExternalServiceError } from '../utils/errors';
import { Character } from '../types/game';

export interface StoryGenerationRequest {
  characterId: string;
  userChoice?: string;
  characterMemories?: any[];
  npcRelationships?: any[];
  factionReputations?: any[];
  activeSideQuests?: any[];
  gameContext?: any;
}

export interface StoryGenerationResponse {
  storyEvent: any;
  character?: any;
  currentStage: number;
}

/**
 * Story service for handling story generation and game progression
 */
export class StoryService {
  constructor(
    private prisma: PrismaClient,
    private claudeService: ClaudeService
  ) {}

  /**
   * Generates next story event using Claude AI
   * @param request Story generation request data
   * @param userId User ID
   * @returns Generated story event and updated character
   */
  async generateStory(request: StoryGenerationRequest, userId: string): Promise<StoryGenerationResponse> {
    try {
      const { characterId, userChoice, characterMemories = [], npcRelationships = [], factionReputations = [], activeSideQuests = [], gameContext = {} } = request;

      // Handle guest mode
      if (userId === 'guest') {
        return this.generateGuestStory(request, gameContext);
      }

      // Get character with relations
      const character = await this.prisma.character.findFirst({
        where: { 
          id: characterId,
          userId: userId 
        },
        include: { 
          items: true,
          skills: true,
          gameState: {
            include: {
              storyEvents: {
                orderBy: { createdAt: 'asc' }
              }
            }
          }
        }
      });

      if (!character || !character.gameState) {
        throw new NotFoundError('Character or game state');
      }

      // Set API waiting state
      await this.prisma.gameState.update({
        where: { id: character.gameState.id },
        data: { waitingForApi: true }
      });

      try {
        // Prepare character data for Claude
        const characterData: Character = {
          id: character.id,
          name: character.name,
          job: character.job as any,
          level: character.level,
          health: character.health,
          maxHealth: character.maxHealth,
          mana: character.mana,
          maxMana: character.maxMana,
          strength: character.strength,
          intelligence: character.intelligence,
          dexterity: character.dexterity,
          constitution: character.constitution,
          inventory: character.items as any,
          gold: character.gold,
          experience: character.experience,
          skills: character.skills as any
        };

        // Prepare story history
        const storyHistory = character.gameState.storyEvents.map((event: any) => ({
          id: event.id,
          stageNumber: event.stageNumber,
          content: event.content,
          choices: event.choices as any,
          type: event.type as any,
          enemyId: event.enemyId || undefined,
          result: event.result || undefined,
          selectedChoice: event.selectedChoice || undefined
        }));

        // Extract world ID
        const worldId = gameContext.worldId || gameContext.worldContext?.worldId || character.gameState.worldId || 'dimensional_rift';

        // Generate story using Claude
        const storyResponse = await this.claudeService.generateStory({
          character: characterData,
          currentStage: character.gameState.currentStage,
          storyHistory,
          userChoice,
          worldId,
          advancedSystems: {
            characterMemories,
            npcRelationships,
            factionReputations,
            activeSideQuests
          },
          gameContext
        }, userId);

        // Save new story event
        const newStoryEvent = await this.prisma.storyEvent.create({
          data: {
            stageNumber: character.gameState.currentStage + 1,
            content: storyResponse.content,
            choices: storyResponse.choices,
            type: storyResponse.type,
            enemyId: storyResponse.enemyId,
            gameStateId: character.gameState.id
          }
        });

        // Update character if changes occurred
        let updatedCharacter = character;
        if (storyResponse.characterChanges) {
          updatedCharacter = await this.applyCharacterChanges(character, storyResponse.characterChanges);
        }

        // Update game state
        await this.prisma.gameState.update({
          where: { id: character.gameState.id },
          data: {
            currentStage: character.gameState.currentStage + 1,
            waitingForApi: false
          }
        });

        return {
          storyEvent: newStoryEvent,
          character: this.formatCharacterResponse(updatedCharacter),
          currentStage: character.gameState.currentStage + 1
        };

      } catch (error) {
        // Reset API waiting state on error
        await this.prisma.gameState.update({
          where: { id: character.gameState.id },
          data: { waitingForApi: false }
        });

        if (error instanceof Error && error.message.includes('Claude')) {
          throw new ExternalServiceError('Claude AI', error.message);
        }
        throw error;
      }

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ExternalServiceError) {
        throw error;
      }
      console.error('Story generation error:', error);
      throw new DatabaseError('Failed to generate story');
    }
  }

  /**
   * Generates fallback story for guest mode
   */
  private async generateGuestStory(request: StoryGenerationRequest, gameContext: any): Promise<StoryGenerationResponse> {
    try {
      const guestCharacterData: Character = {
        id: 'guest-character',
        name: 'Guest Player',
        job: 'Adventurer' as any,
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
      };

      const worldId = gameContext.worldId || 'dimensional_rift';

      try {
        // Try Claude API for guest mode (using Haiku model)
        const storyResponse = await this.claudeService.generateStory({
          character: guestCharacterData,
          currentStage: gameContext.currentStage || 0,
          storyHistory: [],
          userChoice: request.userChoice,
          worldId,
          gameContext
        }, 'guest');

        return {
          storyEvent: {
            id: `guest-story-${Date.now()}`,
            stageNumber: (gameContext.currentStage || 0) + 1,
            content: storyResponse.content,
            choices: storyResponse.choices,
            type: storyResponse.type,
            enemyId: storyResponse.enemyId
          },
          currentStage: (gameContext.currentStage || 0) + 1
        };
      } catch (error) {
        // Fallback to static stories
        return this.generateFallbackStory(worldId, gameContext);
      }
    } catch (error) {
      console.error('Guest story generation error:', error);
      throw new DatabaseError('Failed to generate guest story');
    }
  }

  /**
   * Generates static fallback story when Claude API fails
   */
  private generateFallbackStory(worldId: string, gameContext: any): StoryGenerationResponse {
    const fallbackStories: { [key: string]: any } = {
      'dimensional_rift': {
        content: `차원의 균열에서 이상한 에너지가 솟아납니다. 당신의 주변이 일렁이며 현실이 왜곡되기 시작합니다.`,
        choices: [
          { id: 1, text: "균열 속으로 뛰어든다" },
          { id: 2, text: "차원 마법으로 균열을 조사한다" },
          { id: 3, text: "균열을 봉인하려고 시도한다" },
          { id: 4, text: "안전한 거리에서 관찰한다" }
        ]
      },
      'cyberpunk_2187': {
        content: `네온 불빛이 번쩍이는 야간 거리에서 당신은 수상한 움직임을 감지합니다.`,
        choices: [
          { id: 1, text: "해킹으로 그들의 대화를 엿듣는다" },
          { id: 2, text: "은밀하게 접근한다" },
          { id: 3, text: "사이버웨어로 주변을 스캔한다" },
          { id: 4, text: "다른 길로 우회한다" }
        ]
      }
    };

    const story = fallbackStories[worldId] || fallbackStories['dimensional_rift'];
    
    return {
      storyEvent: {
        id: `fallback-story-${Date.now()}`,
        stageNumber: (gameContext.currentStage || 0) + 1,
        content: story.content,
        choices: story.choices,
        type: '이야기',
        enemyId: null
      },
      currentStage: (gameContext.currentStage || 0) + 1
    };
  }

  /**
   * Applies character changes from Claude response
   */
  private async applyCharacterChanges(character: any, changes: any): Promise<any> {
    const updateData: any = {};
    
    if (changes.health !== undefined) {
      updateData.health = Math.max(0, Math.min(changes.health, character.maxHealth));
    }
    if (changes.mana !== undefined) {
      updateData.mana = Math.max(0, Math.min(changes.mana, character.maxMana));
    }
    if (changes.gold !== undefined) {
      updateData.gold = Math.max(0, changes.gold);
    }
    if (changes.experience !== undefined) {
      updateData.experience = Math.max(character.experience, changes.experience);
    }

    // Handle new items and skills
    if (changes.newItems?.length > 0) {
      await this.addItemsToCharacter(character.id, changes.newItems);
    }
    if (changes.newSkills?.length > 0) {
      await this.addSkillsToCharacter(character.id, changes.newSkills);
    }

    // Update character if there are changes
    if (Object.keys(updateData).length > 0) {
      const updatedCharacter = await this.prisma.character.update({
        where: { id: character.id },
        data: updateData,
        include: {
          items: true,
          skills: true,
          gameState: true
        }
      });

      // Check for level up
      return this.checkLevelUp(updatedCharacter);
    }

    return character;
  }

  /**
   * Adds multiple items to character
   */
  private async addItemsToCharacter(characterId: string, items: string[]): Promise<void> {
    const existingItems = await this.prisma.item.findMany({
      where: { characterId },
      select: { name: true }
    });
    
    const existingItemNames = existingItems.map(item => item.name);
    const newItems = items.filter(itemName => !existingItemNames.includes(itemName));

    if (newItems.length > 0) {
      await this.prisma.item.createMany({
        data: newItems.map(itemName => ({
          name: itemName,
          description: `획득한 아이템: ${itemName}`,
          type: 'misc',
          value: 1,
          characterId: characterId
        }))
      });
    }
  }

  /**
   * Adds multiple skills to character
   */
  private async addSkillsToCharacter(characterId: string, skills: any[]): Promise<void> {
    await this.prisma.skill.createMany({
      data: skills.map(skillData => ({
        name: skillData.name,
        description: skillData.description,
        manaCost: skillData.manaCost,
        damage: skillData.damage || null,
        healing: skillData.healing || null,
        effects: skillData.effects || null,
        characterId: characterId
      }))
    });
  }

  /**
   * Checks and processes level up
   */
  private async checkLevelUp(character: any): Promise<any> {
    const requiredExp = character.level * 100;
    if (character.experience >= requiredExp) {
      const newLevel = character.level + 1;
      const remainingExp = character.experience - requiredExp;
      
      const levelUpData = {
        level: newLevel,
        experience: remainingExp,
        maxHealth: character.maxHealth + 20,
        health: character.maxHealth + 20,
        maxMana: character.maxMana + 10,
        mana: character.maxMana + 10,
        strength: character.strength + 2,
        intelligence: character.intelligence + 2,
        dexterity: character.dexterity + 2,
        constitution: character.constitution + 2
      };
      
      return await this.prisma.character.update({
        where: { id: character.id },
        data: levelUpData,
        include: {
          items: true,
          skills: true,
          gameState: true
        }
      });
    }
    
    return character;
  }

  /**
   * Formats character for API response
   */
  private formatCharacterResponse(character: any): any {
    return {
      id: character.id,
      name: character.name,
      job: character.job,
      level: character.level,
      health: character.health,
      maxHealth: character.maxHealth,
      mana: character.mana,
      maxMana: character.maxMana,
      strength: character.strength,
      intelligence: character.intelligence,
      dexterity: character.dexterity,
      constitution: character.constitution,
      inventory: character.items,
      gold: character.gold,
      experience: character.experience,
      skills: character.skills
    };
  }

  /**
   * Saves game state
   */
  async saveGameState(characterId: string, userId: string, gameState: any): Promise<any> {
    try {
      if (userId === 'guest') {
        return { message: 'Guest mode does not save game state' };
      }

      const character = await this.prisma.character.findFirst({
        where: { 
          id: characterId,
          userId: userId 
        },
        include: { gameState: true }
      });

      if (!character) {
        throw new NotFoundError('Character');
      }

      const updatedGameState = await this.prisma.gameState.upsert({
        where: { characterId: characterId },
        update: {
          currentStage: gameState.currentStage,
          gameStatus: gameState.gameStatus || 'playing',
          waitingForApi: gameState.waitingForApi || false,
          worldId: gameState.worldId || 'dimensional_rift'
        },
        create: {
          userId: userId,
          characterId: characterId,
          currentStage: gameState.currentStage,
          gameStatus: gameState.gameStatus || 'playing',
          waitingForApi: gameState.waitingForApi || false,
          worldId: gameState.worldId || 'dimensional_rift'
        }
      });

      return updatedGameState;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Game state save error:', error);
      throw new DatabaseError('Failed to save game state');
    }
  }

  /**
   * Loads game state
   */
  async loadGameState(characterId: string, userId: string): Promise<any> {
    try {
      if (userId === 'guest') {
        return null;
      }

      const character = await this.prisma.character.findFirst({
        where: { 
          id: characterId,
          userId: userId 
        },
        include: {
          items: true,
          skills: true,
          gameState: {
            include: {
              storyEvents: {
                orderBy: { createdAt: 'asc' }
              }
            }
          }
        }
      });

      if (!character?.gameState) {
        throw new NotFoundError('Game state');
      }

      return {
        character: this.formatCharacterResponse(character),
        currentStage: character.gameState.currentStage,
        gameStatus: character.gameState.gameStatus,
        waitingForApi: character.gameState.waitingForApi,
        storyHistory: character.gameState.storyEvents,
        currentEvent: character.gameState.storyEvents[character.gameState.storyEvents.length - 1] || null,
        worldId: character.gameState.worldId || 'dimensional_rift'
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Game state load error:', error);
      throw new DatabaseError('Failed to load game state');
    }
  }
} 