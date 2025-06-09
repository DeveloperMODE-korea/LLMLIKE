import { Router } from 'express';
import { AdvancedSystemsController } from '../controllers/advancedSystemsController';

const router = Router();
const advancedController = new AdvancedSystemsController();

// === 캐릭터 메모리 라우트 ===
router.post('/characters/:characterId/memories', (req, res) => 
  advancedController.addMemory(req, res)
);

router.get('/characters/:characterId/memories', (req, res) => 
  advancedController.getMemories(req, res)
);

// === 감정 시스템 라우트 ===
router.put('/characters/:characterId/emotions/:npcId', (req, res) => 
  advancedController.updateNPCEmotion(req, res)
);

router.get('/characters/:characterId/emotions', (req, res) => 
  advancedController.getNPCEmotions(req, res)
);

// === 평판 시스템 라우트 ===
router.put('/characters/:characterId/reputation/:factionId', (req, res) => 
  advancedController.updateReputation(req, res)
);

router.get('/characters/:characterId/reputation', (req, res) => 
  advancedController.getReputations(req, res)
);

// === 사이드 퀘스트 시스템 라우트 ===
router.post('/characters/:characterId/quests', (req, res) => 
  advancedController.createSideQuest(req, res)
);

router.get('/characters/:characterId/quests', (req, res) => 
  advancedController.getSideQuests(req, res)
);

router.put('/characters/:characterId/quests/:questId/progress', (req, res) => 
  advancedController.updateQuestProgress(req, res)
);

// === 스토리 분석 라우트 ===
router.get('/characters/:characterId/story-analysis', (req, res) => 
  advancedController.analyzeStory(req, res)
);

export default router; 