# Claude 작업 가이드 — QRManual (Next.js + NestJS + PostgreSQL + Nginx + Docker)

> 이 문서는 Claude가 이 저장소에서 작업할 때 **가장 먼저, 그리고 반복적으로** 참조해야 하는 메인 가이드다.
> 새 기능 추가/마이그레이션/리뷰 모든 단계가 여기서 시작한다.

---

## 0. 프로젝트 개요

**QRManual** — QR 코드를 통해 매뉴얼/제품 정보를 제공하는 웹 서비스.

### 0.1 마이그레이션 컨텍스트 (현재 진행 중)

| 영역 | 기존 (Claude 없이 작성됨) | 마이그레이션 타깃 |
| --- | --- | --- |
| Frontend | Vite + React 19 + Tailwind v4 | **Next.js (App Router)** + Tailwind v4 |
| Backend | Spring Boot 4 + Java 17 + JPA | **NestJS** (Node 22 LTS) |
| DB | PostgreSQL 16 (Docker) | **PostgreSQL 16** (유지) |
| Cache | Redis 7 (Docker) | **Redis 7** (유지, 필요 시 재검토) |
| Reverse Proxy | (없음 / 직접 8080·5173 노출) | **Nginx** (단일 진입점, TLS) |
| Orchestration | `Backend/docker-compose.yml`만 존재 | **루트 `docker-compose.yml`** — front + back + postgres + redis + nginx 통합 |
| 인증 | Spring Security + JWT (자체) | **NestJS Passport + JWT** (자체) |

기존 React/Spring 코드는 **참조 자산**이다. 화면·도메인 로직·API 시그니처를 읽어 NestJS/Next.js 쪽으로 옮긴다. 무지성 1:1 포팅 금지 — 옮길 때 더 나은 패턴이 보이면 그쪽을 택한다.

### 0.2 저장소 레이아웃 (마이그레이션 후 목표)

```
QRManual/
├── front/                  # Next.js
├── back/                   # NestJS
├── nginx/                  # reverse proxy 설정 (conf.d, certs)
├── docker-compose.yml      # dev: front + back + postgres + redis (+ nginx)
├── docker-compose.prod.yml # prod: 위 + nginx + 환경변수·이미지 태그
├── .env.example
└── claude/                 # 메타 가이드 (이 폴더)
```

옛 `Frontend/`(Vite) · `Backend/`(Spring) 트리는 마이그레이션 완료로 제거되었다. 과거 슬라이스 참조가 필요하면 git 히스토리에서 확인.

---

## 1. 모든 단계에 적용되는 원칙

### 1.1 결정은 항상 사용자에게 확인한다
- 기술 스택 (DB·인증 방식·배포 타깃) 변경
- 디렉터리 구조 변경
- 외부 라이브러리 추가
- 환경 변수 키 추가/제거

선택지가 2~4개로 좁혀지면 `AskUserQuestion`으로 묻고, 단일 선택지면 본문에 한 줄로 알리고 진행.

### 1.2 단계를 건너뛰지 않는다
요구사항이 모호한 채로 코드부터 쓰지 않는다. 마이그레이션 작업이라도 *옮기는 단위*가 무엇인지 한 줄로 합의하고 시작한다.
사용자가 "그냥 빨리 만들어줘"라고 해도 핵심 질문 3~5개는 반드시 묻는다.

### 1.3 작은 단위로 커밋한다
한 커밋 = 한 논리적 변경. 자세한 컨벤션은 [`git-commit.md`](./git-commit.md).

### 1.4 의심스러우면 멈추고 묻는다
- 시크릿(.env / DB 비밀번호 / JWT secret)이 보이면 보고만, 자동 처리 금지
- 운영 서버/DB가 거론되면 멈추고 확인
- 기존 마이그레이션·시드를 덮어쓰는 작업은 사전 확인

### 1.5 결정은 문서화한다
스택·라이브러리·디렉터리 구조 등 한 번 정하면 영향이 큰 결정은 [`./architecture/adr/`](./architecture/adr/)에 ADR 한 장으로 남긴다 (폴더는 첫 ADR 작성 시 생성).

---

## 2. 마이그레이션 작업 순서

**원칙**: 도메인 단위로 한 번에 한 슬라이스씩. 인증 → 사용자 → 핵심 도메인(상품/매뉴얼/QR) → 부가기능 순.

### 2.1 슬라이스 1개 = 다음 4단계
1. **기존 코드 파악** — `Backend/src/main/java/...` 또는 `Frontend/src/...`에서 해당 슬라이스 읽고 한 줄 요약
2. **신규 스택으로 포팅** — DTO/엔티티/엔드포인트/페이지 단위로 옮김
3. **연결 검증** — Compose로 DB·서비스 띄우고 신규 슬라이스가 동작하는지 확인
4. **기존 코드 정리** — 신규로 완전히 대체된 부분만 제거. 의심되면 남겨둔다

각 슬라이스마다 영역 파일 (`skill/next.md`, `skill/nest.md`, `skill/postgres.md`)을 먼저 훑는다.

### 2.2 인프라 셋업 순서

마이그레이션 시작 전에 한 번만:

1. 루트 `docker-compose.yml` — postgres + redis 우선 (기존 `Backend/docker-compose.yml`을 루트로 승격)
2. `back/` NestJS 스캐폴딩 — `nest new back` 또는 수동
3. `front/` Next.js 스캐폴딩 — `pnpm create next-app front`
4. `nginx/` 설정 — front:3000 → `/`, back:8080(또는 3001) → `/api/`
5. dev 환경: `docker-compose.override.yml`로 DB·Redis만 컨테이너, 앱은 호스트에서 실행 권장

자세한 절차는 [`skill/postgres.md`](./skill/postgres.md), [`skill/next.md`](./skill/next.md), [`skill/nest.md`](./skill/nest.md) 참조.

---

## 3. Architecture — 스택 결정 (확정 항목)

| 영역 | 결정 | 메모 |
| --- | --- | --- |
| Frontend 라우팅 | Next.js **App Router** | 신규 표준, Pages Router 사용 시 ADR 필수 |
| 렌더링 | 페이지별 SSR/SSG/CSR/ISR | 매뉴얼 본문은 ISR/SSG 후보 |
| 데이터 — ORM | **Drizzle** (확정 2026-05-09) | 가벼움, SQL 가까움, 타입 안전. 기존 JPA 엔티티는 수동으로 schema.ts에 매핑 |
| API 통신 | **REST + OpenAPI**(`@nestjs/swagger`) | 프론트는 `openapi-typescript`로 타입 생성 |
| 서버 상태 | TanStack Query (클라이언트 컴포넌트) | 서버 컴포넌트는 fetch 직접 |
| 클라이언트 상태 | Zustand (글로벌) + useState/useReducer (로컬) | 기존 코드 이미 Zustand 사용 |
| 스타일 | Tailwind v4 | 컴포넌트 라이브러리 선택은 [`design.md`](./design.md) §3 |
| 인증 | NestJS Passport + JWT + OAuth2 (Google/GitHub) | httpOnly 쿠키 (단일 도메인 nginx 통합) |
| 폼·검증 | react-hook-form + zod | 백엔드 DTO는 class-validator |
| 다국어 | `next-intl` (한·영) | 기존 `i18next` 데이터를 `next-intl` 메시지로 변환 |
| 테스트 | Vitest + Playwright | 핵심 흐름 e2e 1개 의무 |
| 운영 모델 | **단일 VM + Docker Compose + Nginx** | front + back + postgres + redis + nginx |
| 패키지 매니저 | **pnpm** | 루트 워크스페이스 후보 (front/back 동시 관리) |
| Node 버전 | **22 LTS** | 루트 `.nvmrc` 고정 |

미확정 항목은 ADR 작성 시점에 결정.

---

## 4. Implementation — 기능 구현

**진행 순서 (각 슬라이스마다 반복)**:
1. 데이터 모델 → 엔티티/마이그레이션
2. 서버 → DTO + Service + Controller (NestJS)
3. UI → 페이지/컴포넌트 (Next.js)
4. 검증 → 단위 테스트(핵심 로직), e2e(해피 패스)

**파일 단위 원칙 (`front/`)**:
- `app/` — 라우트만. 비즈니스 로직 X
- `lib/` — 도메인 로직, 프레임워크 의존 최소
- `components/ui/` — shadcn 복사본 (도입 시)
- `components/<도메인>/` — 도메인 컴포넌트
- 한 파일 300줄 넘으면 분리 고려

**파일 단위 원칙 (`back/`)**:
- 도메인별 모듈 (`AuthModule`, `UserModule`, `ProductModule`, `ManualModule` 등)
- 한 모듈 = `*.module.ts` + `*.controller.ts` + `*.service.ts` + `dto/*.ts` + `entities/*.ts`
- `common/` — Guard·Pipe·Filter·Decorator 공통

자주 반복되는 작업(새 페이지·새 NestJS 모듈·CRUD 한 세트)은 [`./skill/`](./skill/)의 스킬을 호출한다.

---

## 5. Quality & Deploy — 품질·배포

**머지 전 체크리스트**:
- [ ] `pnpm lint` 무경고 (front + back)
- [ ] `pnpm typecheck` 통과
- [ ] **핵심 흐름 e2e 1개 통과 (의무)** — QR 스캔 → 매뉴얼 조회
- [ ] 단위 테스트 — 인증·도메인 핵심 로직
- [ ] `.env.example`이 실제 환경 변수와 일치
- [ ] README에 로컬 실행 / 배포 / 환경 변수 섹션
- [ ] `docker-compose up` 한 번에 모든 서비스 기동 확인

**배포 (단일 VM)**:
- `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
- nginx에서 Let's Encrypt 또는 Caddy 자동 TLS
- DB 백업 — `pg_dump` cron 일 1회 + 외부 객체 스토리지

---

## 6. 폴더 간 책임 구분

| 질문 | 보러 갈 곳 |
| --- | --- |
| "어떤 절차로 진행하지?" | `claude/CLAUDE.md` (이 문서) |
| "이 결정의 근거는?" | `claude/architecture/adr/` (작성 예정) |
| "이 영역에서 어떻게 일하나? (스킬·컨벤션·결정)" | `claude/skill/<영역>.md` |
| "디자인 *원칙·구조*는?" | `claude/design.md` |
| "이 프로젝트의 *디자인 값*(색상·폰트 등)은?" | `claude/plane.md` |
| "커밋 메시지 어떻게?" | `claude/git-commit.md` |
| "이 작업 단위 자동화는?" | `.claude/skills/<name>/SKILL.md` |

---

## 7. 영역별 작업 가이드

각 기술 영역의 **외부 스킬 + 컨벤션 + 결정 메모**를 한 파일에 통합. 작업 시작 전 해당 영역 파일을 먼저 읽는다.

| 영역 | 파일 |
| --- | --- |
| 프론트엔드 (Next.js) | [`skill/next.md`](./skill/next.md) |
| 백엔드 (NestJS) | [`skill/nest.md`](./skill/nest.md) |
| DB (PostgreSQL) | [`skill/postgres.md`](./skill/postgres.md) |
| Lint / Format / Alias | [`skill/lint-format.md`](./skill/lint-format.md) |
| Reverse Proxy / Docker | [`skill/nginx-docker.md`](./skill/nginx-docker.md) |

---

## 8. 이 가이드를 갱신할 때

작업 중 "여기서 헤맸다", "이 결정 기준이 부족했다" 싶으면 해당 파일에 한 줄 추가. 마이그레이션이 끝나면 §0.1과 §3을 다시 정리해 *현재 상태*로 만든다.
