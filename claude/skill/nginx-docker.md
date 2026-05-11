# skill/nginx-docker.md — Reverse Proxy / Docker Compose 영역

이 영역의 **단일 출처(SSoT)**. Nginx 리버스 프록시, Docker Compose 구성, TLS, 운영 절차를 한 곳에 모은다.
Claude는 인프라/배포 관련 작업 전 이 파일을 먼저 훑는다.

> **운영 모델**: 단일 VM + Docker Compose. Nginx가 단일 진입점(80/443) → 내부적으로 front/back 컨테이너로 분기.
> 기존 `Backend/docker-compose.yml`은 backend·postgres·redis 3종만 다룸. 마이그레이션 후 **루트 `docker-compose.yml`**로 승격하고 front + nginx 추가.

---

## 1. 채택한 외부 스킬

없음 — 자체 컨벤션. Nginx/Docker Compose는 표준 도구 문서를 따른다. 이 파일이 단일 출처.

---

## 2. 컨벤션

### 2.1 저장소 레이아웃

```
QRManual/
├── docker-compose.yml          # dev: front + back + postgres + redis (+ nginx 옵션)
├── docker-compose.override.yml # dev 전용 — DB·Redis만 컨테이너, 앱은 호스트 실행 권장
├── docker-compose.prod.yml     # prod: 위 + nginx + 환경변수·이미지 태그·볼륨
├── .env.example                # 키 이름만 (시크릿 값은 X)
├── nginx/
│   ├── conf.d/
│   │   └── default.conf        # 라우팅 규칙
│   ├── certs/                  # Let's Encrypt 또는 Caddy 발급분 마운트
│   └── Dockerfile              # (선택) 커스텀 이미지 — 기본은 nginx:alpine 그대로
├── front/Dockerfile
├── back/Dockerfile
```

### 2.2 docker-compose.yml — 5종 서비스

```yaml
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    depends_on: [front, back]

  front:
    build: ./front
    expose: ["3000"]            # 외부 노출 X, nginx에서만 접근
    env_file: .env
    depends_on: [back]

  back:
    build: ./back
    expose: ["8080"]            # 외부 노출 X
    env_file: .env
    depends_on:
      postgres: { condition: service_healthy }
      redis:    { condition: service_started }

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    expose: ["6379"]

volumes:
  postgres_data:
```

**dev 권장 — `docker-compose.override.yml`**:
- DB·Redis만 컨테이너로 띄움 (포트 호스트에 노출: `5432`, `6379`)
- front·back은 호스트에서 `pnpm dev` 직접 실행 (HMR/리로드 빠름)
- nginx는 dev에서 보통 안 띄움 (front 직접 `localhost:3000`, back은 `localhost:8080`)

### 2.3 nginx 라우팅 (`nginx/conf.d/default.conf`)

기본 분기:
- `/api/` → `back:8080` (NestJS, 경로 그대로 또는 `/api` prefix 제거)
- `/api/docs` → 운영에선 인증 뒤로 또는 차단
- `그 외` → `front:3000` (Next.js)

쿠키 도메인 일치(httpOnly 쿠키 인증)를 위해 **front/back을 같은 호스트**로 노출. CORS 우회.

```nginx
server {
  listen 80;
  server_name qrmanual.example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name qrmanual.example.com;

  ssl_certificate     /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;

  # NestJS API
  location /api/ {
    proxy_pass http://back:8080/;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Next.js (everything else, including HMR/_next/static)
  location / {
    proxy_pass http://front:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        "upgrade";
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  client_max_body_size 20m;   # 매뉴얼 이미지 업로드 고려, 실제 정책에 맞게 조정
}
```

### 2.4 TLS

후보:
- **Let's Encrypt + certbot** — nginx 컨테이너 옆에 certbot 컨테이너, `/.well-known/acme-challenge` 라우트
- **Caddy로 nginx 대체** — 자동 TLS, 설정 더 짧음. nginx에 강한 의존이 없으면 검토 가치 있음

디폴트는 Let's Encrypt + nginx (보편성). Caddy 채택 시 ADR 필수.

### 2.5 환경 변수

`.env.example`은 운영용까지 키 이름만 포함. 실제 값은 git에 안 들어감.

기존 Backend/.env 키 (확인된 것):
- `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `REDIS_HOST`
- (그 외 — Spring 코드에서 추가 확인 필요)

마이그레이션 후 NestJS도 동일 키 유지 권장 (변경 작으면 작을수록 좋음).

신규 추가:
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL`
- `MAIL_HOST`/`MAIL_PORT`/`MAIL_USER`/`MAIL_PASSWORD`/`MAIL_FROM` (메일 모듈)
- `NEXT_PUBLIC_API_BASE_URL` (프론트, 보통 `/api`로 nginx 통해 같은 도메인)

### 2.6 Dockerfile 표준 (참고)

- `front/Dockerfile` — multi-stage: `deps` → `builder` → `runner`. `next start` 또는 `output: "standalone"`로 `node server.js`
- `back/Dockerfile` — multi-stage: `deps` → `builder` → `runner`. `node dist/main.js`
- 두 이미지 모두 비루트 사용자, `NODE_ENV=production`, healthcheck

기존 `Backend/Dockerfile`(Spring/Gradle)은 마이그레이션 완료 시점에 NestJS 표준으로 교체 또는 제거.

### 2.7 운영 명령

```bash
# 운영 기동
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 로그 확인 (특정 서비스)
docker compose logs -f back

# DB 백업
docker compose exec postgres pg_dump -U "$DB_USERNAME" "$DB_NAME" > backup-$(date +%F).sql

# 마이그레이션 적용 (back 컨테이너 entrypoint 또는 수동)
docker compose exec back pnpm typeorm migration:run

# 재배포 (이미지 갱신)
docker compose pull && docker compose up -d
```

---

## 3. 이 프로젝트의 결정 메모

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-05-09 | **단일 진입점 — Nginx (80/443)** | 단일 도메인, httpOnly 쿠키 인증, CORS 우회 |
| 2026-05-09 | **루트 `docker-compose.yml`로 5종 통합 (nginx + front + back + postgres + redis)** | CLAUDE.md §0.2. 기존 `Backend/docker-compose.yml`은 마이그레이션 끝나면 제거 |
| 2026-05-09 | **dev — `docker-compose.override.yml`로 DB·Redis만 컨테이너** | 앱은 호스트 `pnpm dev`로 HMR/리로드 빠름 |
| 2026-05-09 | **prod — `docker-compose.prod.yml`로 nginx + 환경변수·이미지 태그 오버라이드** | 표준 패턴 |
| 2026-05-09 | **TLS — Let's Encrypt + nginx 디폴트** | 보편성. Caddy 대체 시 ADR |
| 2026-05-09 | **`/api/`는 NestJS, 그 외는 Next.js** | 단일 도메인 same-site 쿠키, 라우팅 단순 |
| 2026-05-09 | **운영에서 front·back 포트는 외부 노출 X (`expose`만)** | nginx가 유일한 진입점 |
| 2026-05-09 | **DB는 운영에서 외부 노출 X** | 보안. dev에서만 호스트 5432 노출 |
| (예정) | nginx 로그 회전·집계 정책 | 운영 시작 후 트래픽 보고 결정 |
| (예정) | 백업 — 외부 객체 스토리지 선택(S3/B2/Azure Blob) | 가격·리전 비교 후 결정 |
| (예정) | 무중단 배포 정책 (blue-green vs 단순 재기동) | 트래픽·SLA 보고 결정. 초기엔 단순 재기동(짧은 다운타임) |

---

## 4. 자체 스킬 (Infra 영역)

| 스킬 | 위치 | 상태 |
| --- | --- | --- |
| `add-compose-service` | `.claude/skills/add-compose-service/` | 미작성 — Compose에 새 서비스 추가 |
| `setup-tls` | `.claude/skills/setup-tls/` | 미작성 — Let's Encrypt 발급·갱신 자동화 셋업 |
| `db-backup` | `.claude/skills/db-backup/` | 미작성 — pg_dump cron + 외부 업로드 셋업 |
