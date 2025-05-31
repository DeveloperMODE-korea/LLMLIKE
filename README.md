# LLMLIKE 🎮

**Claude AI 기반 텍스트 로그라이크 웹 RPG 게임**

> 현재 알파 버전 입니다.

## 📋 개요

Claude API를 활용하여 매 턴마다 새로운 스토리와 전투가 동적으로 생성되는 혁신적인 웹 기반 로그라이크 RPG입니다.

## ✨ 주요 기능

### 🎮 게임 시스템
- **동적 스토리 생성**: Claude 3.5 Haiku로 매턴 새로운 모험 생성
- **완전한 RPG 시스템**: 캐릭터 생성, 레벨업, 스킬, 아이템 시스템
- **자동 저장**: 게임 진행 상황 자동 저장 및 복구
- **실시간 캐릭터 상태**: 체력, 마나, 경험치, 골드 실시간 업데이트

### 🏛️ 게임 콘텐츠
- **4개 직업**: 전사, 마법사, 도적, 성직자
- **스킬 시스템**: 직업별 고유 스킬 및 새로운 스킬 습득
- **아이템 시스템**: 모험 중 다양한 아이템 수집 및 인벤토리 관리
- **레벨업**: 자동 레벨업 시 스탯 증가 및 체력/마나 회복

## 🛠 기술 스택

### 프론트엔드
- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **Tailwind CSS** (스타일링)
- **Lucide React** (아이콘)

### 백엔드
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (데이터베이스)

### AI & 외부 서비스
- **Claude 3.5 Haiku** (Anthropic API)

### 인프라
- **Docker & Docker Compose**
- **Nginx** (리버스 프록시)
- **Adminer** (데이터베이스 관리)

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

브라우저에서 **http://localhost** 접속

## 📁 프로젝트 구조

```
LLMLIKE/
├── src/                    # 프론트엔드 소스
│   ├── components/         # React 컴포넌트
│   ├── services/          # API 서비스
│   ├── types/             # TypeScript 타입
│   └── utils/             # 유틸리티 함수
├── server/                 # 백엔드 소스
│   ├── src/
│   │   ├── controllers/   # API 컨트롤러
│   │   ├── services/      # 비즈니스 로직
│   │   ├── routes/        # API 라우트
│   │   └── types/         # 타입 정의
│   └── prisma/            # 데이터베이스 스키마
├── docker-compose.yml     # Docker 설정
├── nginx.conf            # Nginx 설정
└── README.md             # 이 파일
```

## 🎮 게임 플레이 가이드

### 캐릭터 생성
1. 게임 접속 후 "새 게임 시작" 클릭
2. 캐릭터 이름 입력
3. 직업 선택 (전사/마법사/도적/성직자)
4. 게임 시작!

### 게임 진행
- 매턴 Claude AI가 생성한 스토리 읽기
- 제시된 선택지 중 하나 선택
- 캐릭터 상태 변화 확인 (체력, 마나, 경험치, 골드)
- 새로운 스킬이나 아이템 획득시 인벤토리 확인

### 캐릭터 성장
- **경험치**: 100 달성시 자동 레벨업
- **레벨업 보상**: 모든 스탯 +2, 최대 체력 +20, 최대 마나 +10
- **스킬**: 특정 이벤트에서 새로운 스킬 습득 가능
- **아이템**: 모험 중 다양한 아이템 수집

## 🔧 개발자 도구

### 데이터베이스 관리
- **Adminer**: http://localhost:8080
  - 서버: `llmlike-db`
  - 사용자: `postgres`
  - 비밀번호: `llmlike123`
  - 데이터베이스: `llmlike`

### 로그 확인
```bash
# 전체 로그
docker-compose logs -f

# 백엔드 로그만
docker-compose logs -f backend

# 프론트엔드 로그만
docker-compose logs -f frontend
```

### 서비스 재시작
```bash
# 전체 재시작
docker-compose restart

# 특정 서비스만 재시작
docker-compose restart backend
docker-compose restart frontend
```

## 🛡️ 보안 주의사항

- **API 키 보호**: `.env` 파일은 절대 커밋하지 마세요
- **포트 보안**: 프로덕션 환경에서는 필요한 포트만 열어주세요
- **정기 업데이트**: 의존성 패키지를 정기적으로 업데이트하세요

## 🐛 문제 해결

### 일반적인 문제들

**1. Docker 서비스가 시작되지 않는 경우:**
```bash
docker-compose down
docker-compose up --build -d
```

**2. 데이터베이스 연결 실패:**
```bash
# 데이터베이스 컨테이너 상태 확인
docker-compose ps
docker-compose logs db
```

**3. Claude API 에러:**
- `.env` 파일에 올바른 API 키가 설정되었는지 확인
- API 키 권한 및 크레딧 상태 확인

**4. 포트 충돌:**
- 80, 3001, 5432, 8080 포트가 사용중인지 확인
- `docker-compose.yml`에서 포트 변경 가능

## 📊 시스템 요구사항

### 최소 요구사항
- **RAM**: 4GB 이상
- **저장공간**: 2GB 이상
- **CPU**: 듀얼코어 이상

### 권장 요구사항
- **RAM**: 8GB 이상
- **저장공간**: 5GB 이상
- **CPU**: 쿼드코어 이상

## 🔄 업데이트

```bash
# 최신 코드 가져오기
git pull origin main

# 서비스 재빌드 및 재시작
docker-compose down
docker-compose up --build -d
```

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 지원 및 문의

- **이메일**: frexxx9206@naver.com
- **GitHub Issues**: [이슈 등록](https://github.com/DeveloperMODE-korea/LLMLIKE/issues)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🎮 게임 스크린샷
![LLMLIKE1](https://github.com/user-attachments/assets/89ee7a1c-ee0b-41e8-851e-1b1923629d3f)
![LLMLIKE2](https://github.com/user-attachments/assets/1c394233-751a-4f22-b093-e1049ac1b417)
![LLMLIKE3](https://github.com/user-attachments/assets/3947e435-c1d9-4f5d-b170-775ebc1187da)

## 📈 버전 히스토리

- **v1.1.0** (2025.05.31): 완전한 RPG 시스템 구현
- **v1.0.0** (2025.05.31): 초기 버전 릴리즈

---

**🎯 지금 바로 시작하세요!** `docker-compose up -d` 명령어 하나로 완전한 RPG 경험을 즐기실 수 있습니다.
