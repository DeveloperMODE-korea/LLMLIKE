import express from 'express';
import {
  getDashboardStats,
  getPlayers,
  updatePlayer,
  banPlayer,
  getContent,
  createContent,
  updateContentStatus,
  deleteContent,
  getGameSettings,
  updateGameSettings
} from '../controllers/adminController';

const router = express.Router();

// 대시보드 통계
router.get('/dashboard/stats', getDashboardStats);

// 플레이어 관리
router.get('/players', getPlayers);
router.put('/players/:id', updatePlayer);
router.post('/players/:id/ban', banPlayer);

// 콘텐츠 관리
router.get('/content/:type', getContent);
router.post('/content', createContent);
router.put('/content/:type/:id/status', updateContentStatus);
router.delete('/content/:type/:id', deleteContent);

// 게임 설정
router.get('/settings', getGameSettings);
router.put('/settings', updateGameSettings);

export default router; 