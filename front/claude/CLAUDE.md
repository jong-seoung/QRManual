# front — Next.js 프론트엔드

Next.js 15 (App Router, Turbopack) + React 19 + Tailwind v4 + zustand + next-intl + react-hook-form.
전체 정책은 루트 [`claude/CLAUDE.md`](../../claude/CLAUDE.md), 디자인 토큰은 [`./DESIGN.md`](./DESIGN.md).

## 구조 (`src/`)

```
app/                      # App Router (frameworks & drivers)
├── (auth)/               # /login · /signup · /forgot-password · /verify-email · /accept-invite
├── admin/                # /admin/company · /admin/manuals  (refresh_token 쿠키 필요)
├── manuals/              # 로그인 사용자용 매뉴얼 리스트
├── me/bookmarks/         # 개인 북마크
├── p/[id]/               # QR 공개 진입점 (비로그인 OK)
├── oauth2/               # OAuth 콜백
└── layout.tsx            # 루트 레이아웃 — Header + NextIntlClientProvider + theme init
components/
├── header/               # Header · ProfileModal · ThemeToggle · UserMenu
└── ui/                   # button · field · input · image-upload (디자인 시스템)
i18n/                     # next-intl messages
lib/
├── api/                  # 백엔드 호출 래퍼 (auth · bookmarks · company · manuals · …)
└── auth/                 # server.ts (cookies()로 세션) · types.ts
middleware.ts             # /admin, /mypage, /dashboard 보호 — refresh_token 쿠키 유무만 체크
store/                    # zustand stores (auth-store.ts 등)
```

## 핵심 규칙

- **API 호출은 `lib/api/client.ts`의 `apiFetch`만 사용**. 직접 `fetch` 금지. 서버 컴포넌트는 `cookies()`를 `cookieHeader`로 전달, 클라이언트는 `credentials: include`로 자동.
- **인증 게이트 = 미들웨어 + 백엔드**: 미들웨어는 쿠키 존재만 본다(JWT 검증은 백엔드). 보호 prefix는 `middleware.ts`의 `PROTECTED_PREFIXES` 한 곳에서만 관리.
- **테마**: `localStorage.theme === 'dark'` → `<html>`에 `.dark` 클래스. 깜빡임 방지용 `themeInitScript`가 `<head>`에서 동기 실행. 토글은 `components/header/theme-toggle.tsx`.
- **i18n**: 모든 사용자 텍스트는 `next-intl` 메시지로. 하드코딩 한글 금지(에러 메시지 제외).
- **폼**: `react-hook-form` + `components/ui/field.tsx` 패턴. 백엔드 검증 에러는 `apiFetch`가 throw하는 `ApiError`의 `code`로 분기.
- **상태**: 전역 = zustand (`store/`). 서버 데이터 캐시는 RSC fetch에 위임 — 클라이언트 캐시 라이브러리(React Query 등) 도입 금지(YAGNI).

## 디자인 토큰

`src/app/globals.css`의 `@theme` 블록이 단일 진실. 라이트는 Notion 팔레트 그대로, 다크는 `.dark` override로 near-black 베이스 + 보라 액센트 라이트 변형(노션이 다크를 다루지 않음 — Known Gaps). 토큰 추가/변경은 항상 globals.css에서 시작하고 [`./DESIGN.md`](./DESIGN.md)와 정합 맞춤.

기하: 버튼/입력 `rounded-md`(8px), 카드 `rounded-card`(12px), 칩/배지 `rounded-utility`(6px).

## 점진 클린 아키텍처

[`../../claude/skill/next.md`](../../claude/skill/next.md) 참조. 새 기능부터 `entities / application / interface-adapters / infrastructure` 분리. 기존 `lib/api`는 인프라(서비스) 자리.

## 머지 전 체크

- [ ] `pnpm --filter front lint && pnpm --filter front typecheck` 통과
- [ ] UI 변경이면 dev 서버 띄워 라이트/다크 둘 다 눈으로 확인
- [ ] 새 텍스트는 i18n 메시지로 추가, 키 누락 없는지
- [ ] 신규 보호 라우트면 `middleware.ts`의 prefix 갱신
