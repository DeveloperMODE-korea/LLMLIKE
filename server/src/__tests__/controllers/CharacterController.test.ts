import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { CharacterController } from '../../controllers/CharacterController';
import { container } from '../../services';

// Mock the container
vi.mock('../../services', () => ({
  container: {
    characterService: {
      createCharacter: vi.fn(),
      getCharacterById: vi.fn(),
      getUserCharacters: vi.fn(),
      updateCharacterStats: vi.fn()
    }
  }
}));

// Mock presets utility
vi.mock('../../utils/presets', () => ({
  mapStatsToWorld: vi.fn().mockReturnValue({
    health: 100,
    mana: 50,
    strength: 10,
    intelligence: 10,
    dexterity: 10,
    constitution: 10
  }),
  getStartingItems: vi.fn().mockReturnValue(['테스트 아이템']),
  getStartingSkills: vi.fn().mockReturnValue(['테스트 스킬'])
}));

describe('CharacterController', () => {
  let controller: CharacterController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: any;

  beforeEach(() => {
    controller = new CharacterController();
    
    mockRequest = {
      body: {},
      params: {},
      user: { userId: 'test-user-id', email: 'test@test.com', username: 'testuser' }
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };

    mockNext = vi.fn();

    vi.clearAllMocks();
  });

  describe('createCharacter', () => {
    it('should create character successfully for authenticated user', async () => {
      // Arrange
      mockRequest.body = {
        name: 'Test Character',
        job: '⚔️ 전사',
        stats: { health: 100, mana: 50 },
        worldId: 'dimensional_rift'
      };

      const mockCharacter = {
        id: 'char-123',
        name: 'Test Character',
        job: '⚔️ 전사',
        items: [],
        skills: [],
        gameState: { id: 'game-123' }
      };

      (container.characterService.createCharacter as any).mockResolvedValue(mockCharacter);

      // Act
      await controller.createCharacter(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.characterService.createCharacter).toHaveBeenCalledWith({
        name: 'Test Character',
        job: '⚔️ 전사',
        stats: { health: 100, mana: 50 },
        worldId: 'dimensional_rift',
        userId: 'test-user-id'
      });

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          character: mockCharacter,
          gameState: mockCharacter.gameState
        }
      });
    });

    it('should create guest character for guest user', async () => {
      // Arrange
      mockRequest.user = { userId: 'guest', email: 'guest@guest.com', username: 'guest' };
      mockRequest.body = {
        name: 'Guest Character',
        job: '⚔️ 전사',
        stats: { health: 100 },
        worldId: 'dimensional_rift'
      };

      // Act
      await controller.createCharacter(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.characterService.createCharacter).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          character: expect.objectContaining({
            id: 'guest-character',
            name: 'Guest Character',
            job: '⚔️ 전사'
          }),
          gameState: expect.objectContaining({
            id: 'guest-gamestate'
          })
        })
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      // Arrange
      mockRequest.user = undefined;

      // Act
      await controller.createCharacter(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
    });
  });

  describe('getCharacter', () => {
    it('should get character successfully', async () => {
      // Arrange
      mockRequest.params = { characterId: 'char-123' };

      const mockCharacter = {
        id: 'char-123',
        name: 'Test Character',
        items: [],
        skills: []
      };

      (container.characterService.getCharacterById as any).mockResolvedValue(mockCharacter);

      // Act
      await controller.getCharacter(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.characterService.getCharacterById).toHaveBeenCalledWith('char-123', 'test-user-id');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCharacter
      });
    });

    it('should return 404 when character not found', async () => {
      // Arrange
      mockRequest.params = { characterId: 'char-123' };
      (container.characterService.getCharacterById as any).mockResolvedValue(null);

      // Act
      await controller.getCharacter(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Character not found'
      });
    });

    it('should return 404 for guest user', async () => {
      // Arrange
      mockRequest.user = { userId: 'guest', email: 'guest@guest.com', username: 'guest' };
      mockRequest.params = { characterId: 'char-123' };

      // Act
      await controller.getCharacter(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Guest characters are not persistent'
      });
    });
  });

  describe('getUserCharacters', () => {
    it('should get user characters successfully', async () => {
      // Arrange
      const mockCharacters = [
        { id: 'char-1', name: 'Character 1' },
        { id: 'char-2', name: 'Character 2' }
      ];

      (container.characterService.getUserCharacters as any).mockResolvedValue(mockCharacters);

      // Act
      await controller.getUserCharacters(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.characterService.getUserCharacters).toHaveBeenCalledWith('test-user-id');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCharacters
      });
    });

    it('should return empty array for guest user', async () => {
      // Arrange
      mockRequest.user = { userId: 'guest', email: 'guest@guest.com', username: 'guest' };

      // Act
      await controller.getUserCharacters(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(container.characterService.getUserCharacters).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: []
      });
    });
  });
}); 