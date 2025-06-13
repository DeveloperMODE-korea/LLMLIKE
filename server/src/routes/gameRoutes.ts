import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';
import { StoryController } from '../controllers/StoryController';
import { apiKeyController } from '../controllers/apiKeyController';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Initialize controllers
const characterController = new CharacterController();
const storyController = new StoryController();

// Character routes with validation
router.post('/character', 
  optionalAuth, 
  CharacterController.createCharacterValidation,
  characterController.createCharacter.bind(characterController)
);

router.get('/character/:characterId', 
  optionalAuth, 
  characterController.getCharacter.bind(characterController)
);

router.get('/characters', 
  optionalAuth, 
  characterController.getUserCharacters.bind(characterController)
);

router.patch('/character/:characterId',
  optionalAuth,
  characterController.updateCharacter.bind(characterController)
);

// Story routes with validation
router.post('/story/generate', 
  optionalAuth, 
  StoryController.generateStoryValidation,
  storyController.generateStory.bind(storyController)
);

router.post('/choice/submit', 
  optionalAuth, 
  storyController.submitChoice.bind(storyController)
);

// Game state routes
router.get('/gamestate/:characterId', 
  optionalAuth, 
  storyController.getGameState.bind(storyController)
);

router.post('/gamestate/save', 
  optionalAuth, 
  StoryController.gameStateValidation,
  storyController.saveGameState.bind(storyController)
);

router.get('/gamestate/load/:characterId', 
  optionalAuth, 
  storyController.loadGameState.bind(storyController)
);

// API 키 관련 라우트 (기존 유지)
router.post('/api-key/set', optionalAuth, apiKeyController.setApiKey);
router.get('/api-key/check', optionalAuth, apiKeyController.checkApiKey);
router.post('/api-key/test', optionalAuth, apiKeyController.testApiKey);

export default router; 