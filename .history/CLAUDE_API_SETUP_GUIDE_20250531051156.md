# 🚀 LLMLIKE Claude API 구현 완료!

## 📋 구현된 내용

### ✅ 백엔드 시스템
- **Node.js + Express** 서버 구조
- **PostgreSQL + Prisma ORM** 데이터베이스
- **Claude API 연동** 서비스
- **API 키 DB 저장** 시스템
- **RESTful API** 엔드포인트

### ✅ 프론트엔드 연동
- **API 서비스** 모듈
- **API 키 설정** 컴포넌트
- **백엔드 통신** 인터페이스

## 🛠 설치 및 실행 방법

### 1️⃣ PostgreSQL 설치
```bash
# Windows (chocolatey)
choco install postgresql

# macOS (homebrew)
brew install postgresql

# Ubuntu
sudo apt install postgresql postgresql-contrib
```

### 2️⃣ 백엔드 서버 설정
```bash
# 1. 서버 디렉토리로 이동
cd server

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 데이터베이스 연결 정보 입력

# 4. 데이터베이스 마이그레이션
npm run db:generate
npm run db:migrate

# 5. 서버 실행 (개발 모드)
npm run dev
```

### 3️⃣ 프론트엔드 설정
```bash
# 1. 루트 디렉토리에서
cp env.example .env
# .env 파일에 백엔드 API URL 설정

# 2. 개발 서버 실행
npm run dev
```

### 4️⃣ Claude API 키 설정
1. [Anthropic Console](https://console.anthropic.com/)에서 API 키 생성
2. 게임 실행 후 API 키 설정 화면에서 입력
3. 자동으로 데이터베이스에 안전하게 저장

## 📡 API 구조

### 🔑 API 키 관리
- `POST /api/game/api-key/set` - API 키 저장
- `GET /api/game/api-key/check` - API 키 존재 확인
- `POST /api/game/api-key/test` - API 키 유효성 검사

### 🎮 게임 진행
- `POST /api/game/character` - 캐릭터 생성
- `POST /api/game/story/generate` - AI 스토리 생성
- `GET /api/game/gamestate/:id` - 게임 상태 조회
- `POST /api/game/choice/submit` - 선택지 제출

## 🔄 게임 플로우 (AI 연동)

```
1. 사용자가 게임 시작
2. API 키 설정 (최초 1회)
3. 캐릭터 생성 → DB 저장
4. Claude API로 첫 스토리 생성
5. 사용자 선택 → Claude에 전달
6. 새로운 스토리 생성 → DB 저장
7. 100단계까지 반복
```

## 🛡 보안 기능

- **Rate Limiting**: API 호출 제한
- **CORS 설정**: 프론트엔드만 접근 허용
- **Helmet.js**: 보안 헤더
- **API 키 암호화**: DB 저장 시 보안 처리 (권장)

## 🗄 데이터베이스 스키마

- **User**: 사용자 + API 키
- **Character**: 캐릭터 정보
- **GameState**: 게임 진행 상태
- **StoryEvent**: AI 생성 스토리 히스토리
- **Item/Skill/Enemy**: 게임 요소들

## 🚀 다음 단계

### 즉시 가능한 기능
1. ✅ AI 기반 동적 스토리 생성
2. ✅ 사용자별 API 키 관리
3. ✅ 게임 진행 데이터 영구 저장
4. ✅ 실시간 스토리 연속성

### 추후 개선 사항
- [ ] 사용자 인증 시스템
- [ ] Redis 캐싱 (API 비용 절감)
- [ ] API 키 암호화
- [ ] Docker 컨테이너화
- [ ] DigitalOcean 배포

## 💡 사용법

1. **백엔드 실행**: `cd server && npm run dev`
2. **프론트엔드 실행**: `npm run dev`
3. **PostgreSQL 실행**: 로컬 DB 서버 시작
4. **게임 접속**: http://localhost:5173
5. **Claude API 키 입력**: 최초 1회 설정
6. **게임 시작**: AI가 생성하는 무한한 모험!

---

🎉 **축하합니다!** 이제 Claude API가 실시간으로 스토리를 생성하는 완전한 로그라이크 RPG가 준비되었습니다! 