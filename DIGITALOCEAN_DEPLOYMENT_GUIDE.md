# 🌊 DigitalOcean 우분투 서버 배포 가이드

## 📋 배포 전 준비사항

### 1️⃣ DigitalOcean Droplet 생성
- **OS**: Ubuntu 22.04 LTS
- **Plan**: Basic ($12/월 이상 권장)
- **CPU**: 2 vCPU
- **Memory**: 2GB RAM
- **SSD**: 50GB
- **Region**: 한국과 가까운 Singapore 추천

### 2️⃣ 도메인 설정 (선택사항)
- 도메인 구매 후 DigitalOcean Droplet IP와 연결
- DNS A 레코드 설정: `your-domain.com` → `Droplet IP`

### 3️⃣ 환경 변수 준비
```bash
# .env 파일 생성
DB_PASSWORD=your-super-secure-password-here
FRONTEND_URL=https://your-domain.com
```

## 🚀 자동 배포 (권장)

### 1단계: 서버 접속
```bash
ssh root@your-droplet-ip
```

### 2단계: 코드 업로드
```bash
# 로컬에서 서버로 코드 업로드
scp -r . root@your-droplet-ip:/opt/llmlike/

# 또는 Git으로 클론
git clone https://github.com/your-username/llmlike.git /opt/llmlike
cd /opt/llmlike
```

### 3단계: 자동 배포 실행
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

배포 스크립트가 자동으로:
- ✅ Docker 및 Docker Compose 설치
- ✅ 방화벽 설정 (UFW)
- ✅ SSL 인증서 발급 (Let's Encrypt)
- ✅ 컨테이너 빌드 및 실행
- ✅ 헬스체크 수행

## 🛠 수동 배포

### 1단계: 시스템 업데이트
```bash
sudo apt update && sudo apt upgrade -y
```

### 2단계: Docker 설치
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 3단계: Docker Compose 설치
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4단계: 방화벽 설정
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable
```

### 5단계: SSL 인증서 설정 (도메인 있는 경우)
```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d your-domain.com --email your-email@example.com --agree-tos

# 인증서를 적절한 위치로 복사
sudo mkdir -p /etc/nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /etc/nginx/ssl/
```

### 6단계: 환경 변수 설정
```bash
cp .env.example .env
nano .env  # 환경 변수 편집
```

### 7단계: 컨테이너 실행
```bash
docker-compose up --build -d
```

## 📊 배포 후 확인사항

### 서비스 상태 확인
```bash
# 컨테이너 상태
docker-compose ps

# 로그 확인
docker-compose logs -f

# 개별 서비스 로그
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### 헬스체크
```bash
# 백엔드 API
curl http://localhost:3001/health

# 프론트엔드
curl http://localhost/

# HTTPS (도메인 설정 시)
curl https://your-domain.com/health
```

### 데이터베이스 연결 확인
```bash
# PostgreSQL 컨테이너 접속
docker-compose exec db psql -U postgres -d llmlike

# 테이블 확인
\dt
```

## 🔧 운영 관리

### 서비스 제어
```bash
# 서비스 중지
docker-compose down

# 서비스 재시작
docker-compose restart

# 특정 서비스만 재시작
docker-compose restart backend

# 로그 실시간 모니터링
docker-compose logs -f --tail=100
```

### 데이터 백업
```bash
# 데이터베이스 백업
docker-compose exec db pg_dump -U postgres llmlike > backup_$(date +%Y%m%d).sql

# 볼륨 백업
docker run --rm -v project_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup_$(date +%Y%m%d).tar.gz /data
```

### SSL 인증서 자동 갱신
```bash
# 크론탭에 추가 (자동 갱신)
sudo crontab -e

# 다음 라인 추가
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart frontend
```

### 시스템 모니터링
```bash
# 시스템 리소스 확인
htop
df -h
free -h

# Docker 리소스 사용량
docker stats

# 디스크 사용량 정리
docker system prune -a
```

## 🔐 보안 강화

### SSH 보안
```bash
# SSH 키 인증 설정
ssh-copy-id root@your-droplet-ip

# 비밀번호 로그인 비활성화
sudo nano /etc/ssh/sshd_config
# PasswordAuthentication no
sudo systemctl restart ssh
```

### 방화벽 강화
```bash
# 특정 IP만 SSH 허용
sudo ufw delete allow 22
sudo ufw allow from YOUR_IP_ADDRESS to any port 22

# Rate limiting 설정
sudo ufw limit ssh
```

### 정기 업데이트
```bash
# 자동 보안 업데이트 설정
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## 🚨 문제 해결

### 일반적인 문제들

**1. 컨테이너가 시작되지 않는 경우**
```bash
docker-compose logs backend
# 환경 변수나 데이터베이스 연결 확인
```

**2. SSL 인증서 문제**
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

**3. 메모리 부족**
```bash
# 스왑 파일 생성
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**4. 포트 충돌**
```bash
# 포트 사용량 확인
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

## 💰 비용 최적화

### 리소스 모니터링
- DigitalOcean Monitoring 활성화
- 메트릭 기반 알람 설정
- 사용량에 따른 Droplet 크기 조정

### 백업 전략
- DigitalOcean Snapshots (유료)
- 자체 백업 스크립트 활용
- 중요 데이터만 선별적 백업

---

## 🎉 배포 완료!

성공적으로 배포되면:
- **프론트엔드**: `https://your-domain.com`
- **백엔드 API**: `https://your-domain.com/api/game`
- **헬스체크**: `https://your-domain.com/health`

이제 전 세계 어디서나 LLMLIKE 게임을 즐길 수 있습니다! 🌍🎮 