# skill/next.md — 프론트엔드 (Next.js) 영역

이 영역의 **단일 출처(SSoT)**. 채택 스킬, 컨벤션, 결정을 한 곳에 모은다.
Claude는 Next.js 관련 작업 전 이 파일을 먼저 훑는다.

> **마이그레이션 컨텍스트**: 기존 `Frontend/`는 Vite + React 19 + react-router-dom + i18next + Zustand + axios + Tailwind v4. 이 자산을 `front/`(Next.js App Router)로 슬라이스 단위로 옮긴다.

---

## 1. 채택한 외부 스킬

### next-best-practices (Vercel Labs)

| 항목 | 값 |
| --- | --- |
| **출처** | https://github.com/vercel-labs/next-skills |
| **소개 페이지** | https://skills.sh/vercel-labs/next-skills/next-best-practices |
| **설치 명령** | `npx skills add https://github.com/vercel-labs/next-skills --skill next-best-practices` |
| **설치 위치** | `.claude/skills/next-best-practices/` |
| **언제 호출되나** | Next.js 페이지/레이아웃/라우트 작성, 데이터 패칭 패턴, 서버/클라 컴포넌트 분리 결정 시 |
| **CLAUDE.md 단계** | §3 Architecture, §4 Implementation |
| **채택 근거** | Vercel 공식 팀이 유지하는 Next.js 베스트 프랙티스. 자체 작성보다 신뢰도 높고 업데이트도 따라감. |

**충돌 시 우선순위**: 외부 스킬 권장사항을 기본으로 따르되, 이 파일의 §3 결정에 명시한 *프로젝트 고유 규칙*은 그것을 덮어쓴다.

---

## 2. 컨벤션

### 2.1 라우팅
- App Router 기본 (Next.js 15+). Pages Router 사용 시 ADR 필수.
- 동적 세그먼트는 `[param]`, catch-all은 `[...slug]` — 표준 Next.js 규칙
- QRManual 핵심 라우트: `/` (랜딩), `/m/[id]` (매뉴얼 뷰어), `/login`, `/admin/...`

### 2.2 서버 / 클라이언트 컴포넌트
- 기본은 서버 컴포넌트
- `"use client"`는 *필요한 가장 작은 단위*에 (이벤트 핸들러, 브라우저 API, 클라 상태)
- 데이터 패칭은 서버 컴포넌트에서, 인터랙션만 클라 컴포넌트로
- 매뉴얼 뷰어는 SSR/ISR — SEO·첫 페인트 빠름

### 2.3 데이터 패칭
- 서버 컴포넌트 — `fetch`로 NestJS API 호출, Next.js 캐시 활용 (`next: { revalidate: ... }` 또는 `tags`)
- 클라이언트 컴포넌트 — TanStack Query
- 폼 처리 — 간단하면 Server Action, 복잡하면 NestJS 엔드포인트 직접 호출
- API 클라이언트 — `lib/api/` 폴더에 `openapi-typescript` 생성 타입 + 얇은 wrapper

### 2.4 메타데이터 / SEO
- 페이지마다 `export const metadata` 또는 `generateMetadata`
- 매뉴얼 뷰어는 동적 메타데이터 (제품명·설명을 메타에 주입)
- Open Graph / 트위터 카드 — 공통 layout에서 default, 페이지별 override

### 2.5 에러 / 로딩
- 라우트마다 `loading.tsx`, `error.tsx` 명시
- 매뉴얼 뷰어는 not-found.tsx 명시 (잘못된 QR 처리)
- 글로벌 에러는 `app/global-error.tsx`

### 2.6 상태 관리
- 서버 상태 — TanStack Query (캐시·리페칭·낙관적 UI)
- 글로벌 클라 상태 — Zustand (기존 코드에서 이미 사용)
- 로컬 상태 — useState/useReducer

### 2.7 다국어 (i18n)
- `next-intl` 채택 (CLAUDE.md §3)
- 메시지 파일 — `front/messages/<locale>.json`
- 기존 i18next 데이터를 `next-intl` 형식으로 변환 (마이그레이션 시 한 번)
- `<html lang>` 동적 — `next-intl` middleware가 처리

> 위 항목들은 1차 골격. 실제 작업하며 채워짐.

---

## 3. 이 프로젝트의 결정 메모

여기에 "외부 스킬과 다르게 우리가 정한 것"을 한 줄씩 누적.
큰 결정은 `../architecture/adr/`에 ADR로 분리.

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-05-09 | **마이그레이션 — Vite + react-router → Next.js App Router** | CLAUDE.md §0.1. 라우팅·SSR·이미지 최적화·SEO 필요 |
| 2026-05-09 | **저장소 레이아웃 — `front/` 폴더 (옛 `Frontend/`와 공존, 마이그레이션 끝나면 옛 폴더 제거)** | CLAUDE.md §0.2 |
| 2026-05-09 | **호스팅 — 단일 VM의 Docker 컨테이너 (Vercel 안 씀)** | CLAUDE.md §3. Nginx → front:3000 reverse proxy |
| 2026-05-09 | **`front/Dockerfile` 표준 (multi-stage: deps → builder → runner)** | `next start` 모드 운영, `output: "standalone"` 옵션 권장 |
| 2026-05-09 | **API 통신 — REST + OpenAPI codegen (`openapi-typescript`)** | NestJS @nestjs/swagger와 짝 |
| 2026-05-09 | **서버 상태 — TanStack Query, 글로벌 클라 상태 — Zustand 유지** | 기존 코드 이미 Zustand 사용 |
| 2026-05-09 | App Router 단일 사용 (Pages Router 금지) | 신규 작성, 혼재 시 패턴 분기 비용 |
| 2026-05-09 | **i18n — `next-intl`** | App Router 친화. 기존 i18next 메시지 변환 필요 |
| 2026-05-09 | **이미지 최적화 — `next/image` 기본(자체 sharp). Vercel Image Optimization은 안 씀** | VM 컨테이너에서 Next.js 자체 처리 |
| 2026-05-09 | **정적 디자인 자산은 `front/public/` 또는 `front/src/assets/`** | 사용자 업로드 파일은 백엔드 측 별도 (`skill/nest.md`) |
| 2026-05-09 | **Lint/Format/Alias** — 자세한 룰은 [`lint-format.md`](./lint-format.md) | front·back 공통 단일 출처 |
| 2026-05-09 | **재사용 컴포넌트 위치 — `front/src/components/ui/`(shadcn 복사본) + `front/src/components/<도메인>/`** | `design.md` §3과 일치 |
| (예정) | shadcn/ui 도입 여부 | `plane.md` 컨펌 후 결정 |
| (예정) | API 호출 캐시 정책 (매뉴얼 뷰어 ISR vs SSR) | 매뉴얼 갱신 빈도 확인 후 |

---

## 4. 자체 스킬 (Next.js 영역)

작업 단위 자동화는 `.claude/skills/`에 위치. 영역별로 보면:

| 스킬 | 위치 | 상태 |
| --- | --- | --- |
| `add-page` | `.claude/skills/add-page/` | 미작성 |
| `add-route-handler` | `.claude/skills/add-route-handler/` | 미작성 |
| `add-server-action` | `.claude/skills/add-server-action/` | 미작성 |
| `port-vite-page` | `.claude/skills/port-vite-page/` | 미작성 — 옛 `Frontend/` 페이지 한 개를 `front/` App Router로 옮기는 자동화 후보 |
