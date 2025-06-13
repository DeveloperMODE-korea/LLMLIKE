import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { container } from '../services';
import { AppError } from '../utils/errors';

/**
 * Character controller for handling character-related HTTP requests
 */
export class CharacterController {
  /**
   * Validation rules for character creation
   */
  static createCharacterValidation = [
    body('name')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Character name must be between 1 and 50 characters'),
    body('job')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Character job is required'),
    body('stats')
      .isObject()
      .withMessage('Character stats must be an object'),
    body('worldId')
      .optional()
      .isString()
      .withMessage('World ID must be a string')
  ];

  /**
   * Creates a new character
   * POST /api/game/character
   */
  async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { name, job, stats, worldId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Handle guest mode
      if (userId === 'guest') {
        const guestCharacter = this.createGuestCharacter(name, job, stats, worldId);
        const guestGameState = this.createGuestGameState();

        res.json({
          success: true,
          data: {
            character: guestCharacter,
            gameState: guestGameState
          }
        });
        return;
      }

      // Regular user - use service
      const characterService = container.characterService;
      const result = await characterService.createCharacter({
        name,
        job,
        stats,
        worldId: worldId || 'dimensional_rift',
        userId
      });

      res.status(201).json({
        success: true,
        data: {
          character: result,
          gameState: result.gameState
        }
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Gets character by ID
   * GET /api/game/character/:characterId
   */
  async getCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (userId === 'guest') {
        res.status(404).json({
          success: false,
          message: 'Guest characters are not persistent'
        });
        return;
      }

      const characterService = container.characterService;
      const character = await characterService.getCharacterById(characterId, userId);

      if (!character) {
        res.status(404).json({
          success: false,
          message: 'Character not found'
        });
        return;
      }

      res.json({
        success: true,
        data: character
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Gets all user's characters
   * GET /api/game/characters
   */
  async getUserCharacters(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (userId === 'guest') {
        res.json({
          success: true,
          data: []
        });
        return;
      }

      const characterService = container.characterService;
      const characters = await characterService.getUserCharacters(userId);

      res.json({
        success: true,
        data: characters
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Updates character stats
   * PATCH /api/game/character/:characterId
   */
  async updateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      const userId = req.user?.userId;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (userId === 'guest') {
        res.status(403).json({
          success: false,
          message: 'Guest mode does not support character updates'
        });
        return;
      }

      const characterService = container.characterService;
      const updatedCharacter = await characterService.updateCharacterStats(
        characterId,
        userId,
        updates
      );

      res.json({
        success: true,
        data: updatedCharacter
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Creates guest character (in-memory only)
   */
  private createGuestCharacter(name: string, job: string, stats: any, worldId: string): any {
    const { mapStatsToWorld, getStartingItems, getStartingSkills } = require('../utils/presets');
    const mappedStats = mapStatsToWorld(stats, worldId || 'dimensional_rift');
    
    return {
      id: 'guest-character',
      name,
      job,
      level: 1,
      health: mappedStats.health,
      maxHealth: mappedStats.health,
      mana: mappedStats.mana,
      maxMana: mappedStats.mana,
      strength: mappedStats.strength,
      intelligence: mappedStats.intelligence,
      dexterity: mappedStats.dexterity,
      constitution: mappedStats.constitution,
      gold: 0,
      experience: 0,
      userId: 'guest',
      items: getStartingItems(job, worldId || 'dimensional_rift').map((itemName: string, index: number) => ({
        id: `guest-item-${index}`,
        name: itemName,
        description: `시작 장비: ${itemName}`,
        type: 'equipment',
        value: 1,
        characterId: 'guest-character'
      })),
      skills: getStartingSkills(job, worldId || 'dimensional_rift').map((skillName: string, index: number) => ({
        id: `guest-skill-${index}`,
        name: skillName,
        description: `기본 스킬: ${skillName}`,
        manaCost: 5,
        damage: skillName.includes('공격') || skillName.includes('베기') || skillName.includes('기습') ? 10 : null,
        healing: skillName.includes('치유') ? 15 : null,
        characterId: 'guest-character'
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Creates guest game state (in-memory only)
   */
  private createGuestGameState(): any {
    return {
      id: 'guest-gamestate',
      currentStage: 0,
      gameStatus: 'playing',
      waitingForApi: false,
      userId: 'guest',
      characterId: 'guest-character',
      storyEvents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Handles errors and sends appropriate HTTP response
   */
  private handleError(error: any, res: Response): void {
    console.error('CharacterController error:', error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 