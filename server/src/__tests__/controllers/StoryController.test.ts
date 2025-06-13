import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { StoryController } from '../../controllers/StoryController';
import { container } from '../../services';

// Mock the container
vi.mock('../../services', () => ({
  container: {
    storyService: {
      generateStory: vi.fn(),
      saveGameState: vi.fn(),
      loadGameState: vi.fn()
    },
    characterService: {
      getCharacterById: vi.fn()
    },
    prisma: {
      storyEvent: {
        update: vi.fn()
      }
    }
  }
}));

describe('StoryController', () => {
  let controller: StoryController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new StoryController();
    
    mockRequest = {
      body: {},
      params: {},
      user: { userId: 'test-user-id', email: 'test@test.com', username: 'testuser' }
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    vi.clearAllMocks();
  });

  describe('generateStory', () => {
    it('should generate story successfully for authenticated user', async () => {
      // Arrange
      mockRequest.body = {
        characterId: 'char-123',
        userChoice: 'choice 1',
        characterMemories: [],
        npcRelationships: [],
        factionReputations: [],
        activeSideQuests: [],
        gameContext: { worldId: 'dimensional_rift' }
      };

      const mockStoryResult = {
        storyEvent: {
          id: 'story-123',
          content: 'Test story content',
          choices: [{ id: 1, text: 'Choice 1' }]
        },
        character: { id: 'char-123', name: 'Test Character' },
        currentStage: 1
      };

      (container.storyService.generateStory as any).mockResolvedValue(mockStoryResult);

      // Act
      await controller.generateStory(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.storyService.generateStory).toHaveBeenCalledWith({
        characterId: 'char-123',
        userChoice: 'choice 1',
        characterMemories: [],
        npcRelationships: [],
        factionReputations: [],
        activeSideQuests: [],
        gameContext: { worldId: 'dimensional_rift' }
      }, 'test-user-id');

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockStoryResult
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      // Arrange
      mockRequest.user = undefined;

      // Act
      await controller.generateStory(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
    });
  });

  describe('saveGameState', () => {
    it('should save game state successfully', async () => {
      // Arrange
      mockRequest.body = {
        characterId: 'char-123',
        gameState: {
          currentStage: 5,
          gameStatus: 'playing',
          worldId: 'dimensional_rift'
        }
      };

      const mockSaveResult = { id: 'gamestate-123', currentStage: 5 };
      (container.storyService.saveGameState as any).mockResolvedValue(mockSaveResult);

      // Act
      await controller.saveGameState(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.storyService.saveGameState).toHaveBeenCalledWith(
        'char-123',
        'test-user-id',
        {
          currentStage: 5,
          gameStatus: 'playing',
          worldId: 'dimensional_rift'
        }
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSaveResult
      });
    });

    it('should handle guest mode for save game state', async () => {
      // Arrange
      mockRequest.user = { userId: 'guest', email: 'guest@guest.com', username: 'guest' };
      mockRequest.body = {
        characterId: 'guest-character',
        gameState: { currentStage: 1 }
      };

      // Act
      await controller.saveGameState(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.storyService.saveGameState).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Guest mode does not save game state',
        data: null
      });
    });
  });

  describe('loadGameState', () => {
    it('should load game state successfully', async () => {
      // Arrange
      mockRequest.params = { characterId: 'char-123' };

      const mockGameState = {
        character: { id: 'char-123', name: 'Test Character' },
        currentStage: 5,
        gameStatus: 'playing',
        storyHistory: [],
        worldId: 'dimensional_rift'
      };

      (container.storyService.loadGameState as any).mockResolvedValue(mockGameState);

      // Act
      await controller.loadGameState(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.storyService.loadGameState).toHaveBeenCalledWith('char-123', 'test-user-id');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockGameState
      });
    });

    it('should handle guest mode for load game state', async () => {
      // Arrange
      mockRequest.user = { userId: 'guest', email: 'guest@guest.com', username: 'guest' };
      mockRequest.params = { characterId: 'guest-character' };

      // Act
      await controller.loadGameState(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.storyService.loadGameState).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Guest mode does not load game state',
        data: null
      });
    });
  });

  describe('submitChoice', () => {
    it('should submit choice successfully for regular user', async () => {
      // Arrange
      mockRequest.body = {
        storyEventId: 'story-123',
        choiceId: 1
      };

      const mockUpdatedEvent = { id: 'story-123', selectedChoice: 1 };
      (container.prisma.storyEvent.update as any).mockResolvedValue(mockUpdatedEvent);

      // Act
      await controller.submitChoice(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.prisma.storyEvent.update).toHaveBeenCalledWith({
        where: { id: 'story-123' },
        data: { selectedChoice: 1 }
      });

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedEvent
      });
    });

    it('should handle guest mode for submit choice', async () => {
      // Arrange
      mockRequest.user = { userId: 'guest', email: 'guest@guest.com', username: 'guest' };
      mockRequest.body = {
        storyEventId: 'guest-story-123',
        choiceId: 2
      };

      // Act
      await controller.submitChoice(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.prisma.storyEvent.update).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Guest mode choice recorded',
        data: { storyEventId: 'guest-story-123', choiceId: 2 }
      });
    });
  });
}); 