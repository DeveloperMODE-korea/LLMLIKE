import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 보안 미들웨어
app.use(helmet());

// CORS 설정
const allowedOrigins = [
  'http://localhost',           // nginx 프록시
  'http://localhost:3000',      // 개발 서버 (옵션)
  'http://localhost:5173',      // Vite 개발 서버
  process.env.FRONTEND_URL || 'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15분
  max: parseInt(process.env.RATE_LIMIT_MAX || '100') // 최대 100회 요청
});
app.use(limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use('/api/game', gameRoutes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'LLMLIKE Backend'
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 리소스를 찾을 수 없습니다.'
  });
});

// 에러 핸들러
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('서버 오류:', err);
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : '내부 서버 오류가 발생했습니다.'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 LLMLIKE 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 프론트엔드 URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app; 