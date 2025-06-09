import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthController {
  
  async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body as RegisterRequest;
      
      // 유효성 검사
      if (!email || !username || !password) {
        return res.status(400).json({ 
          error: '이메일, 사용자명, 비밀번호를 모두 입력해주세요.' 
        });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ 
          error: '비밀번호는 최소 6자 이상이어야 합니다.' 
        });
      }
      
      // 이메일 형식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: '올바른 이메일 형식을 입력해주세요.' 
        });
      }
      
      const result = await authService.register({ email, username, password });
      
      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        data: result
      });
      
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : '회원가입에 실패했습니다.' 
      });
    }
  }
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as LoginRequest;
      
      // 유효성 검사
      if (!email || !password) {
        return res.status(400).json({ 
          error: '이메일과 비밀번호를 입력해주세요.' 
        });
      }
      
      const result = await authService.login({ email, password });
      
      res.json({
        message: '로그인이 완료되었습니다.',
        data: result
      });
      
    } catch (error) {
      res.status(401).json({ 
        error: error instanceof Error ? error.message : '로그인에 실패했습니다.' 
      });
    }
  }
  
  async getProfile(req: Request, res: Response) {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ error: '인증이 필요합니다.' });
      }
      
      res.json({
        message: '프로필 조회 성공',
        data: {
          id: user.userId,
          email: user.email,
          username: user.username
        }
      });
      
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : '프로필 조회에 실패했습니다.' 
      });
    }
  }
}

export const authController = new AuthController(); 