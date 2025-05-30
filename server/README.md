# LLMLIKE 백엔드 서버

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
cd server
npm install
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
cp env.example .env

# .env 파일 편집 (PostgreSQL 연결 정보 및 Claude API 키 설정)
DATABASE_URL="postgresql://username:password@localhost:5432/llmlike"
DEFAULT_CLAUDE_API_KEY="your-claude-api-key-here"
```

### 3. PostgreSQL 데이터베이스 설정
```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:migrate

# (선택사항) Prisma Studio로 DB 확인
npm run db:studio
```

### 4. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 📡 API 엔드포인트

### 🎮 게임 관련
- `POST /api/game/character` - 캐릭터 생성
- `POST /api/game/story/generate` - 스토리 생성 (Claude API)
- `GET /api/game/gamestate/:characterId` - 게임 상태 조회
- `POST /api/game/choice/submit` - 선택지 제출

### 🔑 API 키 관리
- `POST /api/game/api-key/set` - Claude API 키 설정
- `GET /api/game/api-key/check` - API 키 존재 여부 확인
- `POST /api/game/api-key/test` - API 키 유효성 테스트

### 🏥 헬스 체크
- `GET /health` - 서버 상태 확인

## 🗄️ 데이터베이스 스키마

- **User**: 사용자 정보 및 Claude API 키
- **Character**: 캐릭터 정보 (이름, 직업, 스탯)
- **GameState**: 게임 진행 상태
- **StoryEvent**: 스토리 이벤트 히스토리
- **Item**: 아이템 정보
- **Skill**: 스킬 정보
- **Enemy**: 적 정보

## 🔧 주요 기능

### Claude API 연동
- 사용자별 API 키 저장 (암호화 권장)
- 스토리 동적 생성
- API 키 유효성 검사
- 에러 핸들링

### 보안
- Helmet.js (보안 헤더)
- CORS 설정
- Rate Limiting
- 입력 검증

### 데이터베이스
- Prisma ORM
- PostgreSQL
- 관계형 데이터 모델

## 📋 TODO

- [ ] 사용자 인증 시스템 추가
- [ ] API 키 암호화 저장
- [ ] Redis 캐싱 구현
- [ ] 로깅 시스템 개선
- [ ] 테스트 코드 작성
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인 구축 