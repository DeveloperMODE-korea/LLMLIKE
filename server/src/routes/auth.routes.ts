import express from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// 회원가입
router.post('/register', authController.register);

// 로그인
router.post('/login', authController.login);

// 프로필 조회 (인증 필요)
router.get('/profile', authenticateToken, authController.getProfile);

export default router; 