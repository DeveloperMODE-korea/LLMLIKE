import { Router } from 'express';
import { gameController } from '../controllers/gameController';
import { apiKeyController } from '../controllers/apiKeyController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// 게임 관련 라우트 (인증 필요)
router.post('/character', authenticateToken, gameController.createCharacter);
router.post('/story/generate', authenticateToken, gameController.generateStory);
router.get('/gamestate/:characterId', authenticateToken, gameController.getGameState);
router.post('/choice/submit', authenticateToken, gameController.submitChoice);

// API 키 관련 라우트 (인증 필요)
router.post('/api-key/set', authenticateToken, apiKeyController.setApiKey);
router.get('/api-key/check', authenticateToken, apiKeyController.checkApiKey);
router.post('/api-key/test', authenticateToken, apiKeyController.testApiKey);

export default router; 