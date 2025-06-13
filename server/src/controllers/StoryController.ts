import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { container } from '../services';
import { AppError } from '../utils/errors';

/**
 * Story controller for handling story generation and game progression
 */
export class StoryController {
  /**
   * Validation rules for story generation
   */
  static generateStoryValidation = [
    body('characterId')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Character ID is required'),
    body('userChoice')
      .optional()
      .isString()
      .withMessage('User choice must be a string'),
    body('characterMemories')
      .optional()
      .isArray()
      .withMessage('Character memories must be an array'),
    body('npcRelationships')
      .optional()
      .isArray()
      .withMessage('NPC relationships must be an array'),
    body('factionReputations')
      .optional()
      .isArray()
      .withMessage('Faction reputations must be an array'),
    body('activeSideQuests')
      .optional()
      .isArray()
      .withMessage('Active side quests must be an array'),
    body('gameContext')
      .optional()
      .isObject()
      .withMessage('Game context must be an object')
  ];

  /**
   * Validation rules for game state operations
   */
  static gameStateValidation = [
    body('characterId')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Character ID is required'),
    body('gameState')
      .isObject()
      .withMessage('Game state must be an object')
  ];

  /**
   * Generates next story event
   * POST /api/game/story/generate
   */
  async generateStory(req: Request, res: Response): Promise<void> {
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

      const {
        characterId,
        userChoice,
        characterMemories = [],
        npcRelationships = [],
        factionReputations = [],
        activeSideQuests = [],
        gameContext = {}
      } = req.body;

      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      console.log('🎮 Story generation request:', {
        characterId,
        userChoice,
        memoriesCount: characterMemories.length,
        relationshipsCount: npcRelationships.length,
        reputationsCount: factionReputations.length,
        sideQuestsCount: activeSideQuests.length,
        userId
      });

      const storyService = container.storyService;
      const result = await storyService.generateStory({
        characterId,
        userChoice,
        characterMemories,
        npcRelationships,
        factionReputations,
        activeSideQuests,
        gameContext
      }, userId);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Gets game state by character ID
   * GET /api/game/gamestate/:characterId
   */
  async getGameState(req: Request, res: Response): Promise<void> {
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
          message: 'Guest game states are not persistent'
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
   * Saves game state
   * POST /api/game/gamestate/save
   */
  async saveGameState(req: Request, res: Response): Promise<void> {
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

      const { characterId, gameState } = req.body;
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
          message: 'Guest mode does not save game state',
          data: null
        });
        return;
      }

      const storyService = container.storyService;
      const result = await storyService.saveGameState(characterId, userId, gameState);

      console.log('🎮 Game state saved:', {
        characterId,
        stage: gameState.currentStage,
        worldId: gameState.worldId,
        userId
      });

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Loads game state
   * GET /api/game/gamestate/load/:characterId
   */
  async loadGameState(req: Request, res: Response): Promise<void> {
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
        res.json({
          success: true,
          message: 'Guest mode does not load game state',
          data: null
        });
        return;
      }

      const storyService = container.storyService;
      const gameState = await storyService.loadGameState(characterId, userId);

      console.log('🎮 Game state loaded:', {
        characterId,
        stage: gameState?.currentStage,
        worldId: gameState?.worldId,
        userId
      });

      res.json({
        success: true,
        data: gameState
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Submits choice for current event
   * POST /api/game/choice/submit
   */
  async submitChoice(req: Request, res: Response): Promise<void> {
    try {
      const { storyEventId, choiceId } = req.body;
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
          message: 'Guest mode choice recorded',
          data: { storyEventId, choiceId }
        });
        return;
      }

      // For regular users, update the story event with selected choice
      const prisma = container.prisma;
      const storyEvent = await prisma.storyEvent.update({
        where: { id: storyEventId },
        data: { selectedChoice: choiceId }
      });

      res.json({
        success: true,
        data: storyEvent
      });

    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles errors and sends appropriate HTTP response
   */
  private handleError(error: any, res: Response): void {
    console.error('StoryController error:', error);

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