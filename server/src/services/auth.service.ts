import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RegisterRequest, LoginRequest, AuthResponse, JwtPayload } from '../types/auth';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const { email, username, password } = data;
    
    // 기존 사용자 확인
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('이미 사용 중인 이메일입니다.');
      }
      if (existingUser.username === username) {
        throw new Error('이미 사용 중인 사용자명입니다.');
      }
    }
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });
    
    // JWT 토큰 생성
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token
    };
  }
  
  async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;
    
    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('등록되지 않은 이메일입니다.');
    }
    
    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('잘못된 비밀번호입니다.');
    }
    
    // JWT 토큰 생성
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token
    };
  }
  
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      
      // 사용자가 여전히 존재하는지 확인
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('유효하지 않은 토큰입니다.');
    }
  }
  
  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}

export const authService = new AuthService(); 