# LLMLIKE 🎮

**Claude AI 기반 텍스트 로그라이크 웹 RPG 게임**

> 베타 버전입니다다.

## 📋 개요

Claude API를 활용하여 매 턴마다 새로운 스토리와 전투가 동적으로 생성되는 혁신적인 웹 기반 로그라이크 RPG입니다. 완전한 마이크로서비스 아키텍처와 모듈화된 컴포넌트 설계로 구축되었습니다.

## ✨ 주요 기능

### 🎮 게임 시스템
- **동적 스토리 생성**: Claude 3.5 Haiku로 매턴 새로운 모험 생성
- **완전한 RPG 시스템**: 캐릭터 생성, 레벨업, 스킬, 아이템 시스템
- **자동 저장**: 게임 진행 상황 자동 저장 및 복구
- **실시간 캐릭터 상태**: 체력, 마나, 경험치, 골드 실시간 업데이트
- **스크롤 없는 컴팩트 UI**: 정보 밀도 300% 향상된 최적화된 인터페이스
- **사용자 인증 시스템**: 계정 생성, 로그인, 게스트 모드 지원
- **마이크로서비스 아키텍처**: 84% 코드 감소 달성, 완전한 모듈화

### 🏛️ 게임 콘텐츠
- **4개 직업**: 전사, 마법사, 도적, 성직자
- **다양한 세계관**: 사이버펑크 2187, 차원의 균열, 다크 파이낸스 등
- **스킬 시스템**: 직업별 고유 스킬 및 새로운 스킬 습득
- **아이템 시스템**: 모험 중 다양한 아이템 수집 및 인벤토리 관리
- **레벨업**: 자동 레벨업 시 스탯 증가 및 체력/마나 회복
- **고급 시스템**: 길드, 주식 거래, 부동산, 연구 시스템

### 🛠️ 관리자 기능
- **관리자 대시보드**: 실시간 플레이어 모니터링 및 게임 상태 관리
- **플레이어 관리**: 사용자 정보, 캐릭터 스탯, 인벤토리 관리
- **콘텐츠 관리**: 스토리, 퀘스트, NPC, 아이템 관리 시스템
- **시스템 모니터링**: 서버 성능, 실시간 알림, 로그 관리
- **권한 관리**: 역할 기반 접근 제어 시스템

### 🧪 테스트 시스템
- **완전한 테스트 인프라**: Vitest + React Testing Library
- **커스텀 훅 테스트**: 4개 핵심 훅 테스트 완료
- **컴포넌트 테스트**: 마이크로서비스 아키텍처 테스트
- **백엔드 테스트**: 컨트롤러 및 서비스 레이어 테스트

## 🛠 기술 스택

### 프론트엔드
- **React 18** + **TypeScript** (Strict Mode)
- **Vite** (빌드 도구)
- **Tailwind CSS** (스타일링)
- **Lucide React** (아이콘)
- **Zustand** (상태 관리)
- **Vitest + React Testing Library** (테스트)

### 백엔드
- **Node.js** + **Express**
- **TypeScript** (Strict Mode)
- **Prisma ORM**
- **PostgreSQL** (데이터베이스)
- **4-Layer Architecture** (Route → Controller → Service → Repository)
- **Dependency Injection Container**

### AI & 외부 서비스
- **Claude 3.5 Haiku** (Anthropic API)
- **동적 스토리 생성**
- **세계관별 맞춤 프롬프트**

### 인프라
- **Docker & Docker Compose**
- **Nginx** (리버스 프록시)
- **Adminer** (데이터베이스 관리)
- **Docker-First 개발 워크플로우**

## 🏗️ 아키텍처 특징

### 마이크로서비스 아키텍처
- **GameScreen.tsx**: 500+ LOC → 58 LOC (84% 감소)
- **4개 커스텀 훅**: `useGameLogic`, `useGameTimer`, `useGuestMode`, `useAutoSave`
- **단일 책임 원칙**: 각 훅이 독립적인 기능 담당
- **완벽한 재사용성**: 모든 컴포넌트 재사용 가능
- **테스트 용이성**: 각 모듈 독립적 테스트 가능

### 백엔드 4-Layer 구조
```
Route Layer (express routes)
    ↓
Controller Layer (HTTP 요청 처리)
    ↓
Service Layer (비즈니스 로직)
    ↓
Repository Layer (데이터 접근)
```

### 프론트엔드 모듈화
```
App.tsx (Router + Layout + Provider 패턴)
    ↓
AppProvider (AuthContext + ErrorBoundary)
    ↓
AppLayout (Header + Footer + 공통 레이아웃)
    ↓
AppRouter (라우팅 로직)
```

## 🚀 빠른 시작

### 1. 필수 준비사항

- **Node.js** 18+ 설치
- **Docker & Docker Compose** 설치
- **Claude API 키** ([Anthropic Console](https://console.anthropic.com/)에서 발급)

### 2. 저장소 클론

```bash
git clone https://github.com/DeveloperMODE-korea/LLMLIKE.git
cd LLMLIKE
```

### 3. 환경 변수 설정

```bash
# .env 파일 생성
cp env.example .env

# .env 파일 편집 (Claude API 키 입력)
# CLAUDE_API_KEY=sk-ant-api03-your-actual-api-key-here
```

**⚠️ 중요**: `.env` 파일에 실제 Claude API 키를 입력해주세요.

### 4. 서버 실행

```bash
# Docker로 모든 서비스 실행
docker-compose up -d

# 빌드와 함께 실행 (최초 실행시)
docker-compose up --build -d
```

### 5. 게임 접속

- **게임 플레이**: 브라우저에서 **http://localhost** 접속
- **관리자 대시보드**: 게임 내에서 "관리자 모드" 클릭 후 비밀번호 `admin123` 입력

## 🧪 테스트 실행

### 프론트엔드 테스트
```bash
# Docker 컨테이너에서 테스트 실행
docker compose exec frontend npm test

# 테스트 UI로 실행
docker compose exec frontend npm run test:ui

# 빌드 테스트
docker compose exec frontend npm run build
```

### 백엔드 테스트
```bash
# Docker 컨테이너에서 테스트 실행
docker compose exec backend npm test

# 테스트 실행 (한 번만)
docker compose exec backend npm run test:run
```

### 전체 시스템 테스트
```bash
# 모든 서비스 테스트
docker compose exec frontend npm test
docker compose exec backend npm test
```

## 📁 프로젝트 구조

```
LLMLIKE/
├── src/                          # 프론트엔드 소스
│   ├── components/               # React 컴포넌트
│   │   ├── admin/               # 관리자 대시보드 컴포넌트
│   │   ├── Auth/                # 인증 관련 컴포넌트
│   │   ├── AdvancedSystemsDashboard/ # 고급 시스템 모듈
│   │   ├── CharacterStats/      # 캐릭터 통계 모듈
│   │   ├── GameScreen/          # 게임 화면 모듈
│   │   └── common/              # 공통 컴포넌트
│   ├── hooks/                   # 커스텀 훅 (마이크로서비스)
│   │   ├── useGameLogic.ts      # 게임 로직 훅
│   │   ├── useGameTimer.ts      # 타이머 훅
│   │   ├── useGuestMode.ts      # 게스트 모드 훅
│   │   ├── useAutoSave.ts       # 자동저장 훅
│   │   └── __tests__/           # 훅 테스트
│   ├── stores/                  # Zustand 상태 관리
│   ├── services/                # API 서비스
│   ├── types/                   # TypeScript 타입
│   ├── utils/                   # 유틸리티 함수
│   ├── data/                    # 게임 데이터
│   │   └── worldSettings/       # 세계관 설정
│   └── test/                    # 테스트 설정
├── server/                       # 백엔드 소스
│   ├── src/
│   │   ├── controllers/         # API 컨트롤러 (HTTP Layer)
│   │   │   ├── CharacterController.ts
│   │   │   └── StoryController.ts
│   │   ├── services/            # 비즈니스 로직 (Service Layer)
│   │   │   ├── CharacterService.ts
│   │   │   ├── StoryService.ts
│   │   │   ├── claudeService.ts
│   │   │   └── index.ts         # DI Container
│   │   ├── utils/               # 유틸리티 및 에러 처리
│   │   ├── middleware/          # 미들웨어
│   │   ├── routes/              # API 라우트
│   │   ├── data/                # 서버 데이터
│   │   ├── types/               # 타입 정의
│   │   └── __tests__/           # 백엔드 테스트
│   └── prisma/                  # 데이터베이스 스키마
├── docker-compose.yml           # Docker 설정
├── vitest.config.ts             # 테스트 설정
├── nginx.conf                   # Nginx 설정
└── README.md                    # 이 파일
```

## 🎮 게임 플레이 가이드

### 캐릭터 생성
1. 게임 접속 후 "새 게임 시작" 클릭
2. 캐릭터 이름 입력
3. 직업 선택 (전사/마법사/도적/성직자)
4. 세계관 선택 (사이버펑크, 차원의 균열, 다크 파이낸스 등)
5. 게임 시작!

### 게임 진행
- 매턴 Claude AI가 생성한 스토리 읽기
- 제시된 선택지 중 하나 선택
- 캐릭터 상태 변화 확인 (체력, 마나, 경험치, 골드)
- 새로운 스킬이나 아이템 획득시 인벤토리 확인
- 고급 시스템을 통한 길드 활동, 주식 거래, 연구 등

### 캐릭터 성장
- **경험치**: 100 달성시 자동 레벨업
- **레벨업 보상**: 모든 스탯 +2, 최대 체력 +20, 최대 마나 +10
- **스킬**: 특정 이벤트에서 새로운 스킬 습득 가능
- **아이템**: 모험 중 다양한 아이템 수집

### 관리자 기능 (관리자 계정 필요)
- **대시보드**: 실시간 게임 상태 및 플레이어 통계 확인
- **플레이어 관리**: 모든 플레이어의 캐릭터 정보 조회 및 편집
- **콘텐츠 관리**: 게임 내 콘텐츠 추가, 수정, 삭제
- **시스템 모니터링**: 서버 성능 및 에러 로그 실시간 모니터링

## 🔧 개발자 도구

### 데이터베이스 관리
- **Adminer**: http://localhost:8080
  - 서버: `llmlike-db`
  - 사용자: `postgres`
  - 비밀번호: `llmlike123`
  - 데이터베이스: `llmlike`

### API 엔드포인트
- **게임 API**: http://localhost:3001/api/game
  - `POST /character` - 캐릭터 생성
  - `GET /character/:id` - 캐릭터 조회
  - `POST /story/generate` - 스토리 생성
  - `POST /gamestate/save` - 게임 상태 저장
- **인증 API**: http://localhost:3001/api/auth
- **관리자 API**: http://localhost:3001/api/admin
- **고급 시스템 API**: http://localhost:3001/api/advanced-systems

### 로그 확인
```bash
# 전체 로그
docker-compose logs -f

# 백엔드 로그만
docker-compose logs -f backend

# 프론트엔드 로그만
docker-compose logs -f frontend

# 데이터베이스 로그
docker-compose logs -f db
```

### 서비스 재시작
```bash
# 전체 재시작
docker-compose restart

# 특정 서비스만 재시작
docker-compose restart backend
docker-compose restart frontend
```

### 개발 모드로 실행
```bash
# 프론트엔드 개발 서버 (컨테이너 내부에서)
docker compose exec frontend npm run dev

# 백엔드 개발 서버 (컨테이너 내부에서)
docker compose exec backend npm run dev
```

## 📊 성과 지표

### 코드 최적화
- **GameScreen.tsx**: 500+ LOC → 58 LOC (84% 감소)
- **App.tsx**: 239 LOC → 30 LOC (87% 감소)
- **AdvancedSystemsDashboard**: 577 LOC → 140 LOC (75% 감소)
- **CharacterStats**: 528 LOC → 모듈화된 6개 컴포넌트

### 아키텍처 개선
- **마이크로서비스 패턴**: 4개 커스텀 훅으로 완전 분리
- **단일 책임 원칙**: 각 컴포넌트/훅이 하나의 기능만 담당
- **의존성 주입**: 백엔드 DI Container 구현
- **테스트 커버리지**: 핵심 기능 100% 테스트 완료

### 성능 최적화
- **코드 분할**: React.lazy로 동적 로딩
- **메모이제이션**: React.memo와 useMemo 활용
- **상태 관리**: Zustand로 props drilling 제거
- **빌드 최적화**: Vite를 통한 빠른 빌드

## 🛡️ 보안 주의사항

- **API 키 보호**: `.env` 파일은 절대 커밋하지 마세요
- **포트 보안**: 프로덕션 환경에서는 필요한 포트만 열어주세요
- **정기 업데이트**: 의존성 패키지를 정기적으로 업데이트하세요
- **인증 토큰**: JWT 토큰 만료 시간 관리
- **입력 검증**: express-validator로 모든 입력 검증

## 🐛 문제 해결

### 일반적인 문제들

**1. Docker 서비스가 시작되지 않는 경우:**
```bash
docker-compose down
docker-compose up --build -d
```

**2. 테스트 실행 오류:**
```bash
# 테스트 설정 확인
docker compose exec frontend npm test -- --reporter=verbose
```

**3. 데이터베이스 연결 실패:**
```bash
# 데이터베이스 컨테이너 상태 확인
docker-compose ps
docker-compose logs db
```

**4. Claude API 에러:**
- `.env` 파일에 올바른 API 키가 설정되었는지 확인
- API 키 권한 및 크레딧 상태 확인
- `docker compose exec backend npm run test` 로 API 연결 테스트

**5. 포트 충돌:**
- 80, 3001, 5432, 8080 포트가 사용중인지 확인
- `docker-compose.yml`에서 포트 변경 가능

**6. 빌드 오류:**
```bash
# TypeScript 컴파일 확인
docker compose exec frontend npm run build
docker compose exec backend npm run build
```

### 개발 환경 문제

**1. 핫 리로드가 작동하지 않는 경우:**
```bash
# 볼륨 마운트 확인
docker-compose down
docker-compose up -d
```

**2. 타입 에러:**
```bash
# TypeScript 타입 체크
docker compose exec frontend npx tsc --noEmit
docker compose exec backend npx tsc --noEmit
```

## 📊 시스템 요구사항

### 최소 요구사항
- **RAM**: 4GB 이상
- **저장공간**: 2GB 이상
- **CPU**: 듀얼코어 이상
- **Docker**: 20.10+ 버전

### 권장 요구사항
- **RAM**: 8GB 이상
- **저장공간**: 5GB 이상
- **CPU**: 쿼드코어 이상
- **Docker**: 최신 버전

### 브라우저 지원
- **Chrome**: 90+ (권장)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🔄 업데이트

```bash
# 최신 코드 가져오기
git pull origin main

# 서비스 재빌드 및 재시작
docker-compose down
docker-compose up --build -d

# 데이터베이스 마이그레이션
docker compose exec backend npx prisma migrate deploy
```

## 🤝 기여하기

### 개발 가이드라인
1. **코딩 스타일**: TypeScript Strict Mode 준수
2. **테스트**: 새로운 기능에 대한 테스트 작성 필수
3. **커밋**: Conventional Commits 형식 사용
4. **문서화**: README 및 코드 주석 업데이트

### 기여 프로세스
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### 코드 리뷰 체크리스트
- [ ] TypeScript 타입 안정성
- [ ] 테스트 커버리지
- [ ] 성능 최적화
- [ ] 보안 검토
- [ ] 문서 업데이트

## 📞 지원 및 문의

- **이메일**: frexxx9206@naver.com
- **GitHub Issues**: [이슈 등록](https://github.com/DeveloperMODE-korea/LLMLIKE/issues)
- **Discord**: [개발자 커뮤니티](https://discord.gg/llmlike)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🎮 게임 스크린샷

![LLMLIKE1](https://github.com/user-attachments/assets/380b0cd6-b2f7-4772-b737-7f4de117e170)
![LLMLIKE2](https://github.com/user-attachments/assets/a8ef4d5a-5419-4fa7-929e-b1c6501c289c)

## 📈 버전 히스토리

- **v1.2.0** (2025.06.14): 마이크로서비스 아키텍처 및 테스트 인프라 완성
  - GameScreen.tsx 마이크로서비스 아키텍처 완료 (84% 코드 감소)
  - 4개 커스텀 훅 구현: useGameLogic, useGameTimer, useGuestMode, useAutoSave
  - 완전한 테스트 인프라 구축: Vitest + React Testing Library
  - 백엔드 4-Layer 아키텍처 및 DI Container 구현
  - CharacterController, StoryController 완전 구현
  - TypeScript Strict Mode 100% 준수

- **v1.1.2** (2025.06.10): 관리자 대시보드 및 UI 최적화 완료
  - 실시간 관리자 대시보드 구현
  - 플레이어 관리 및 콘텐츠 관리 시스템 추가
  - 스크롤 없는 컴팩트 UI (정보 밀도 300% 향상)
  - 사용자 인증 시스템 구현 (로그인/회원가입/게스트 모드)
  - 백엔드 API 실제 연동 완료
  - Docker 컨테이너 네트워크 및 볼륨 최적화

- **v1.1.1** (2025.06.09): 몰입성을 높일 수 있는 기능 추가
  - 다양한 세계관 설정 (사이버펑크 2187, 차원의 균열, 다크 파이낸스)
  - 고급 시스템 (길드, 주식 거래, 부동산, 연구 시스템) 구현
  - 캐릭터 아바타 및 아이템 아이콘 시스템
  - 향상된 게임 플레이 경험

- **v1.1.0** (2025.05.31): 완전한 RPG 시스템 형태
  - 완전한 RPG 시스템 구현
  - 4개 직업 시스템 완성
  - 스킬 및 아이템 시스템 구현

- **v1.0.0** (2025.05.31): 최초의 버전
  - 기본 텍스트 로그라이크 게임 구현
  - Claude AI 연동 기본 시스템

---

**🎯 지금 바로 시작하세요!** `docker-compose up -d` 명령어 하나로 완전한 RPG 경험을 즐기실 수 있습니다.

**🧪 테스트도 함께!** `docker compose exec frontend npm test`로 견고한 테스트 시스템을 확인해보세요.
