import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { JwtPayload } from '../types/auth';

// Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 게스트 모드 확인
    const isGuestMode = req.headers['x-guest-mode'] === 'true';
    if (isGuestMode) {
      // 게스트 사용자 설정
      req.user = {
        userId: 'guest',
        email: 'guest@example.com',
        username: 'Guest User'
      };
      next();
      return;
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: '액세스 토큰이 없습니다.' });
    }

    const user = await authService.validateToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: error instanceof Error ? error.message : '토큰 검증에 실패했습니다.' 
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await authService.validateToken(token);
      req.user = user;
    }
    
    next();
  } catch (error) {
    // 선택적 인증이므로 오류가 있어도 계속 진행
    next();
  }
}; 