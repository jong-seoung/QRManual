# skill/nest.md — 백엔드 (NestJS) 영역

이 영역의 **단일 출처(SSoT)**. 채택 스킬, 컨벤션, 결정을 한 곳에 모은다.
Claude는 NestJS 관련 작업 전 이 파일을 먼저 훑는다.

> **마이그레이션 컨텍스트**: 기존 `Backend/`는 Spring Boot 4 + Java 17 + JPA + Spring Security + JWT + Redis + Mail. 도메인 단위(인증/사용자/상품/매뉴얼/QR)로 NestJS `back/`로 옮긴다.

---

## 1. 채택한 외부 스킬

### nestjs-best-practices (kadajett / agent-nestjs-skills)

| 항목 | 값 |
| --- | --- |
| **출처** | https://github.com/kadajett/agent-nestjs-skills |
| **소개 페이지** | https://skills.sh/kadajett/agent-nestjs-skills/nestjs-best-practices |
| **설치 명령** | `npx skills add https://github.com/kadajett/agent-nestjs-skills --skill nestjs-best-practices` |
| **설치 위치** | `.claude/skills/nestjs-best-practices/` |
| **언제 호출되나** | NestJS 모듈/엔드포인트 추가, DTO·Validation 작성, Auth/Guard·Interceptor 도입, 테스트 구성 시 |
| **CLAUDE.md 단계** | §3 Architecture, §4 Implementation |
| **채택 근거** | Vercel Labs Next.js 스킬과 짝이 되는 NestJS용 베스트 프랙티스. 자체 컨벤션 작성 비용 절감. |

**충돌 시 우선순위**: 외부 스킬 권장사항을 기본으로 따르되, 이 파일의 §3 결정에 명시한 *프로젝트 고유 규칙*은 그것을 덮어쓴다.

---

## 2. 컨벤션

### 2.1 모듈 구조
- 도메인별 모듈 (`AuthModule`, `UserModule`, `ProductModule`, `ManualModule`, `QrModule` 등)
- `*.controller.ts` / `*.service.ts` / `*.module.ts` / `dto/*.ts` / `entities/*.ts` 표준
- 도메인 간 의존은 모듈 import로만, 직접 service import 금지
- 공통은 `back/src/common/` (Guard·Pipe·Filter·Decorator)

### 2.2 DTO와 검증
- 요청/응답 모두 DTO 클래스로 명시
- `class-validator` + `class-transformer` 기본
- `ValidationPipe`를 `main.ts`에서 글로벌 적용 (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`)
- Swagger 데코레이터 (`@ApiProperty`) DTO에 부착 → `openapi-typescript`로 프론트 타입 생성

### 2.3 인증 / 권한
- `@nestjs/passport` + `passport-jwt` + `passport-local` 표준 조합 (CLAUDE.md §3 결정)
- OAuth2 — `passport-google-oauth20`, `passport-github2`. 콜백에서 자체 JWT 발급 후 httpOnly 쿠키로 셋업
- Access + Refresh 이중 토큰. **httpOnly 쿠키** 저장 (단일 도메인 nginx 통합)
- Guard로 인증, RolesGuard 같은 커스텀 Guard로 권한
- 기존 Spring Security 정책을 1:1 옮기되, NestJS 관용 어법 우선 (Strategy 분리, RolesGuard 데코레이터 등)

### 2.4 에러 처리
- 도메인 에러는 NestJS HttpException 상속한 커스텀 클래스
- 글로벌 ExceptionFilter로 응답 포맷 통일 (`{ error: { code, message } }`)
- Validation 에러도 같은 포맷으로 매핑

### 2.5 로깅
- `Logger` 인스턴스를 서비스마다 주입
- 요청 로깅은 미들웨어 또는 인터셉터로
- 운영 환경에서는 JSON 포맷 (nginx 로그와 함께 grep·tail 가능)

### 2.6 메일 / Redis (기존 자산)
- 기존 Spring 코드의 메일·Redis 사용 흐름 파악 → NestJS 모듈로 옮김
  - 메일 — `@nestjs-modules/mailer` (또는 `nodemailer` 직접) — 후보 결정 후 ADR
  - Redis — `@nestjs/cache-manager` + `cache-manager-redis-store` 또는 `ioredis` 직접
- Redis 사용처(세션? 토큰 블랙리스트? 캐시?)를 마이그레이션 전 명확화

### 2.7 OpenAPI / Swagger
- `@nestjs/swagger` 글로벌 설정
- `/api/docs` 경로 노출 (운영은 인증 뒤로)
- 프론트는 `openapi-typescript`로 `/api/docs-json`에서 타입 생성

> 위 항목들은 1차 골격. 실제 작업하며 채워짐.

---

## 3. 이 프로젝트의 결정 메모

여기에 "외부 스킬과 다르게 우리가 정한 것"을 한 줄씩 누적.
큰 결정은 `../architecture/adr/`에 ADR로 분리.

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-05-09 | **마이그레이션 — Spring Boot 4 → NestJS** | CLAUDE.md §0.1. 프론트와 같은 TS 생태계로 통일, 인계 단순화 |
| 2026-05-09 | **저장소 레이아웃 — `back/` 폴더 (옛 `Backend/`와 공존, 마이그레이션 끝나면 제거)** | CLAUDE.md §0.2 |
| 2026-05-09 | **인증 — NestJS Passport + JWT + OAuth2 (Google/GitHub) (Access + Refresh, httpOnly 쿠키)** | CLAUDE.md §3. 단일 도메인 nginx 통합이라 same-site 쿠키 가능. OAuth2도 같은 쿠키로 통합 |
| 2026-05-09 | **ORM — Drizzle (확정)** | 가벼움, SQL 친화, 타입 안전. JPA 엔티티는 수동으로 `schema.ts` 매핑. 운영 마이그레이션 도구는 `drizzle-kit` |
| 2026-05-09 | **API 통신 — REST + OpenAPI(@nestjs/swagger)** | 프론트 `openapi-typescript`와 짝 |
| 2026-05-09 | **백엔드 호스팅 — 단일 VM의 Docker 컨테이너** | CLAUDE.md §3. PaaS·서버리스 폐기 |
| 2026-05-09 | **`back/Dockerfile` 표준 (multi-stage: deps → builder → runner)** | `node dist/main.js` 기동 |
| 2026-05-09 | **Lint/Format/Alias** — 자세한 룰은 [`lint-format.md`](./lint-format.md) | front·back 공통 단일 출처 |
| 2026-05-09 | **토큰 저장 — httpOnly 쿠키** | 단일 도메인 nginx 통합으로 same-site 쿠키 가능. CSRF는 SameSite=lax + 더블 서밋 토큰 |
| (예정) | **Redis 사용 범위** — 기존 코드의 사용처 파악 후 NestJS 모듈로 옮김 | 토큰 블랙리스트? 세션? 캐시? — 마이그레이션 전 확인 필수 |
| (예정) | **메일 라이브러리** — `@nestjs-modules/mailer` vs `nodemailer` 직접 | 기존 메일 흐름(가입 인증? 비밀번호 재설정?) 파악 후 결정 |
| (예정) | **업로드 이미지/파일 저장 위치** | 후보: A) VM 볼륨(`/data/uploads`, nginx 서빙), B) S3. 매뉴얼 이미지 양·트래픽 보고 결정 |

---

## 4. 자체 스킬 (NestJS 영역)

작업 단위 자동화는 `.claude/skills/`에 위치. 영역별로 보면:

| 스킬 | 위치 | 상태 |
| --- | --- | --- |
| `add-nest-module` | `.claude/skills/add-nest-module/` | 미작성 |
| `add-nest-endpoint` | `.claude/skills/add-nest-endpoint/` | 미작성 |
| `add-dto` | `.claude/skills/add-dto/` | 미작성 |
| `port-spring-controller` | `.claude/skills/port-spring-controller/` | 미작성 — 옛 `Backend/` Controller 한 개를 `back/` 모듈로 옮기는 자동화 후보 |
