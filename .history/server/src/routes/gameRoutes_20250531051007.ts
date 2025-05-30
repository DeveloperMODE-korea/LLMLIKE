import { Router } from 'express';
import { gameController } from '../controllers/gameController';
import { apiKeyController } from '../controllers/apiKeyController';

const router = Router();

// 게임 관련 라우트
router.post('/character', gameController.createCharacter);
router.post('/story/generate', gameController.generateStory);
router.get('/gamestate/:characterId', gameController.getGameState);
router.post('/choice/submit', gameController.submitChoice);

// API 키 관련 라우트
router.post('/api-key/set', apiKeyController.setApiKey);
router.get('/api-key/check', apiKeyController.checkApiKey);
router.post('/api-key/test', apiKeyController.testApiKey);

export default router; 