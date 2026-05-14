# QRManual — 모노레포 진입점

QR로 매뉴얼·제품 정보를 즉시 보여주는 서비스. pnpm workspaces 모노레포.

## 구조

```
QRManual/
├── front/                # Next.js 15 (App Router) — front/claude/CLAUDE.md 참조
├── back/                 # NestJS 11 + Drizzle (Postgres) — back/claude/CLAUDE.md 참조
├── claude/
│   ├── CLAUDE.md         # 이 문서 — 전체 정책 진입점
│   ├── DESIGN.md         # (front 전용 디자인 토큰은 front/claude/DESIGN.md)
│   └── skill/            # 점진 적용용 클린 아키텍처 스킬
│       ├── nest.md       # back 적용 가이드
│       └── next.md       # front 적용 가이드
├── nginx/                # 운영용 리버스 프록시 (front + back 같은 도메인 통합)
├── docker-compose.yml             # 운영: nginx + front + back + postgres + redis
└── docker-compose.override.yml    # dev: postgres(5433) · redis(6380)만 호스트 노출
```

## 공통 정책

- **스코프 = 매뉴얼만**: 주문/결제/그 외 도메인은 *아직* 안 한다. 미래 분기 제안이 들어와도 일단 거절하고 매뉴얼 흐름만 단단하게. YAGNI 강하게.
- **권한 모델**: `SUPER`(시스템) + `OWNER`/`ADMIN`/`USER`(회사 스코프) + 회사 없는 개인 user. `/signup`은 회사 분기. 한 사용자 = 한 회사. 자세한 스키마는 `back/src/db/schema/users.ts`.
- **스토리지**: dev = 로컬 볼륨(`back/uploads`, `/uploads` 정적 서빙), prod = S3. 둘 다 `STORAGE` 인터페이스(`back/src/common/storage/storage.types.ts`)로 추상화. `STORAGE_DRIVER=local|s3` 또는 `NODE_ENV`로 자동 분기.
- **자동 머지**: 작업이 끝나면 항상 main에 머지 + 커밋까지 자동으로 마무리한다. `git push`나 PR 생성은 사용자 명시 요청 없이는 하지 않는다.
- **디자인 동기화**: 노션이 원본. 토큰 갱신은 `npx getdesign@latest add notion md` 로 `front/claude/DESIGN.md`를 재생성한 뒤 `front/src/app/globals.css`의 `@theme` 블록에 반영. 노션이 다루지 않는 영역(예: 다크 토큰)은 "Known Gaps" 표시 후 자체 결정.

## 워크플로

- **큰 작업 = 5역할 sub-agent 디스패치**: 대표 / 프론트 / 백 / 디자인 / 검수. 각자 영역 보고 → 메인이 통합. 작은 변경은 직접.
- **타입체크·린트**: 루트에서 `pnpm typecheck`, `pnpm lint`. 양쪽 워크스페이스에 재귀.
- **dev 실행**: `pnpm compose:dev` 로 DB·Redis 띄우고, 양 앱은 호스트에서 `pnpm dev` (parallel 워크스페이스 dev).

## 점진 마이그레이션 (클린 아키텍처)

전체 리팩토링하지 말 것. 새 기능부터 다음 가이드의 레이어로 작성:

- 백엔드: [`claude/skill/nest.md`](skill/nest.md) — domain / application / presentation / infrastructure 4-레이어
- 프론트: [`claude/skill/next.md`](skill/next.md) — entities / application / interface-adapters / infrastructure / frameworks 5-레이어

## 하위 가이드

- 프론트엔드 상세: [`front/claude/CLAUDE.md`](../front/claude/CLAUDE.md)
- 백엔드 상세: [`back/claude/CLAUDE.md`](../back/claude/CLAUDE.md)
- 디자인 토큰: [`front/claude/DESIGN.md`](../front/claude/DESIGN.md)
