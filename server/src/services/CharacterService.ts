import { PrismaClient, Character } from '@prisma/client';
import { NotFoundError, ValidationError, DatabaseError } from '../utils/errors';
import { mapStatsToWorld, getStartingItems, getStartingSkills } from '../utils/presets';

export interface CreateCharacterInput {
  name: string;
  job: string;
  stats: any;
  worldId: string;
  userId: string;
}

export interface CharacterWithRelations extends Character {
  items: any[];
  skills: any[];
  gameState?: any;
}

/**
 * Character service for handling character-related business logic
 */
export class CharacterService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Creates a new character with starting items and skills in a transaction
   * @param input Character creation data
   * @returns Created character with relations
   */
  async createCharacter(input: CreateCharacterInput): Promise<CharacterWithRelations> {
    try {
      const { name, job, stats, worldId, userId } = input;

      // Validate input
      if (!name?.trim()) {
        throw new ValidationError('Character name is required');
      }
      if (!job?.trim()) {
        throw new ValidationError('Character job is required');
      }

      // Map stats to character structure
      const mappedStats = mapStatsToWorld(stats, worldId || 'dimensional_rift');

      // Get starting items and skills
      const startingItems = getStartingItems(job, worldId || 'dimensional_rift');
      const startingSkills = getStartingSkills(job, worldId || 'dimensional_rift');

      // Create character with items and skills in a single transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create character
        const character = await tx.character.create({
          data: {
            name: name.trim(),
            job,
            health: mappedStats.health,
            maxHealth: mappedStats.health,
            mana: mappedStats.mana,
            maxMana: mappedStats.mana,
            strength: mappedStats.strength,
            intelligence: mappedStats.intelligence,
            dexterity: mappedStats.dexterity,
            constitution: mappedStats.constitution,
            userId: userId
          }
        });

        // Create starting items
        const items = await Promise.all(
          startingItems.map(itemName =>
            tx.item.create({
              data: {
                name: itemName,
                description: `시작 장비: ${itemName}`,
                type: 'equipment',
                value: 1,
                characterId: character.id
              }
            })
          )
        );

        // Create starting skills
        const skills = await Promise.all(
          startingSkills.map(skillName =>
            tx.skill.create({
              data: {
                name: skillName,
                description: `기본 스킬: ${skillName}`,
                manaCost: 5,
                damage: skillName.includes('공격') || skillName.includes('베기') || skillName.includes('기습') ? 10 : null,
                healing: skillName.includes('치유') ? 15 : null,
                characterId: character.id
              }
            })
          )
        );

        // Create initial game state
        const gameState = await tx.gameState.create({
          data: {
            userId: userId,
            characterId: character.id,
            gameStatus: 'playing',
            worldId: worldId || 'dimensional_rift'
          }
        });

        return { character, items, skills, gameState };
      });

      return {
        ...result.character,
        items: result.items,
        skills: result.skills,
        gameState: result.gameState
      };

    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Character creation error:', error);
      throw new DatabaseError('Failed to create character');
    }
  }

  /**
   * Gets character by ID with all relations
   * @param characterId Character ID
   * @param userId User ID for ownership verification
   * @returns Character with relations or null
   */
  async getCharacterById(characterId: string, userId: string): Promise<CharacterWithRelations | null> {
    try {
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

      return character;
    } catch (error) {
      console.error('Character retrieval error:', error);
      throw new DatabaseError('Failed to retrieve character');
    }
  }

  /**
   * Gets all characters for a user
   * @param userId User ID
   * @returns Array of characters
   */
  async getUserCharacters(userId: string): Promise<CharacterWithRelations[]> {
    try {
      const characters = await this.prisma.character.findMany({
        where: { userId: userId },
        include: {
          gameState: true,
          items: true,
          skills: true
        },
        orderBy: { updatedAt: 'desc' }
      });

      return characters;
    } catch (error) {
      console.error('User characters retrieval error:', error);
      throw new DatabaseError('Failed to retrieve user characters');
    }
  }

  /**
   * Updates character stats
   * @param characterId Character ID
   * @param userId User ID for ownership verification
   * @param updates Stat updates
   * @returns Updated character
   */
  async updateCharacterStats(
    characterId: string, 
    userId: string, 
    updates: Partial<Pick<Character, 'health' | 'mana' | 'gold' | 'experience' | 'level'>>
  ): Promise<CharacterWithRelations> {
    try {
      // Verify ownership
      const existingCharacter = await this.getCharacterById(characterId, userId);
      if (!existingCharacter) {
        throw new NotFoundError('Character');
      }

      const updatedCharacter = await this.prisma.character.update({
        where: { id: characterId },
        data: updates,
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

      return updatedCharacter;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Character update error:', error);
      throw new DatabaseError('Failed to update character');
    }
  }

  /**
   * Adds item to character inventory
   * @param characterId Character ID
   * @param itemName Item name
   * @param description Item description
   * @returns Created item
   */
  async addItem(characterId: string, itemName: string, description?: string): Promise<any> {
    try {
      const item = await this.prisma.item.create({
        data: {
          name: itemName,
          description: description || `획득한 아이템: ${itemName}`,
          type: 'misc',
          value: 1,
          characterId: characterId
        }
      });

      return item;
    } catch (error) {
      console.error('Item creation error:', error);
      throw new DatabaseError('Failed to add item');
    }
  }

  /**
   * Adds skill to character
   * @param characterId Character ID
   * @param skillData Skill information
   * @returns Created skill
   */
  async addSkill(characterId: string, skillData: {
    name: string;
    description: string;
    manaCost: number;
    damage?: number;
    healing?: number;
    effects?: any;
  }): Promise<any> {
    try {
      const skill = await this.prisma.skill.create({
        data: {
          ...skillData,
          characterId: characterId
        }
      });

      return skill;
    } catch (error) {
      console.error('Skill creation error:', error);
      throw new DatabaseError('Failed to add skill');
    }
  }
} 