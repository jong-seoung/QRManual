# back — NestJS 백엔드

NestJS 11 + Drizzle ORM(Postgres 16) + Redis 7 + argon2 + passport(local/JWT/Google/GitHub).
전체 정책은 루트 [`../../claude/CLAUDE.md`](../../claude/CLAUDE.md).

## 구조 (`src/`)

```
auth/                     # 로컬 + OAuth(Google/GitHub) + JWT(access/refresh)
├── strategies/           # jwt-access · jwt-refresh · google · github
├── guards/               # JwtAuthGuard · JwtRefreshGuard · SystemRolesGuard · CompanyRolesGuard
├── decorators/           # @Public · @CurrentUser · @SystemRoles · @CompanyRoles
├── dto/                  # 요청 DTO (class-validator)
├── auth.service.ts       # 회원가입/로그인/검증 — argon2 해시
├── oauth.service.ts      # OAuth 콜백 → 사용자 매칭/생성
├── token.service.ts      # access/refresh 발급·회전, Redis 블랙리스트
├── mail.service.ts       # nodemailer (검증/초대/비밀번호 재설정)
└── users.service.ts
company/                  # 회사 + 멤버 + 초대 (invitations)
manuals/                  # 매뉴얼 마스터 (회사 스코프) + 공개 진입 controller
manual-pdfs/              # 매뉴얼 PDF(언어별/버전별)
parts/ · faqs/            # 매뉴얼 부속 컨텐츠
bookmarks/                # 사용자 북마크
customer-services/        # 고객 문의
uploads/                  # 파일 업로드 진입점
common/
├── filters/              # GlobalHttpExceptionFilter — { error: { code, message } } 포맷
├── redis/                # ioredis 클라이언트
└── storage/              # STORAGE 토큰 + LocalStorage · S3Storage (storage.module.ts에서 분기)
db/
├── db.module.ts          # Drizzle pg pool 주입
└── schema/               # companies · users · invitations · manuals · manual-pdfs · bookmarks · manual-extras
app.module.ts             # Throttler(120/min) · ServeStatic(local일 때만) · 도메인 모듈 import
main.ts                   # cookie-parser + ValidationPipe(whitelist+transform) + GlobalFilter + Swagger(/api/docs)
```

## 핵심 규칙

- **권한 데코레이터로만 게이팅**: `@SystemRoles('SUPER')` / `@CompanyRoles('OWNER','ADMIN')`. 컨트롤러 안에서 if-분기로 권한 검사 금지.
- **모든 컨트롤러는 DTO + ValidationPipe**: `main.ts`에서 `whitelist: true, forbidNonWhitelisted: true, transform: true`. DTO 외 필드는 자동 차단되므로 DTO 누락 = 검증 누락.
- **에러는 NestJS HttpException + GlobalHttpExceptionFilter**: 응답 포맷 `{ error: { code, message } }`. 프론트 `apiFetch`가 이 포맷에 의존.
- **인증 토큰**: access는 짧고 메모리/응답에서 사용, refresh는 httpOnly 쿠키. 회전은 `token.service.ts`. 블랙리스트는 Redis.
- **스토리지**: 항상 `@Inject(STORAGE) private storage: StorageDriver` 사용. `LocalStorage` / `S3Storage` 직접 참조 금지. dev는 `STORAGE_DRIVER=local` 또는 미설정(NODE_ENV≠production), prod는 `s3`.
- **회사 스코프**: 회사 자원(`manuals`, `parts`, `faqs`, `bookmarks`)의 모든 read/write는 `user.companyId` 기준 필터링. `SUPER`만 회사 경계 없이 접근 가능. 누락은 정보 유출 버그.
- **트랜잭션**: Drizzle `db.transaction(async (tx) => ...)`. 멀티 테이블 쓰기는 트랜잭션 필수.

## DB 스키마 · 마이그레이션

- 스키마는 `src/db/schema/`의 Drizzle pgTable. `index.ts`에서 재수출.
- 변경 흐름:
  1. 스키마 파일 수정
  2. `pnpm --filter back db:generate` — 마이그레이션 SQL 생성
  3. 검토 후 `pnpm --filter back db:migrate`
- 빠른 dev 동기화는 `db:push` (마이그레이션 미생성 — 데이터 휘발 OK일 때만).
- 권한 모델: `users.systemRole`('SUPER'|null) + `users.companyId` + `users.companyRole`('OWNER'|'ADMIN'|'USER'|null). 한 사용자 = 한 회사.

## 점진 클린 아키텍처

[`../../claude/skill/nest.md`](../../claude/skill/nest.md) 참조. 새 기능은 `domain/entities → application/use-cases → application/ports → infrastructure/persistence` 순으로 작성. 기존 모듈 구조는 유지하되 자주 손대는 곳(auth, manuals)부터 이전.

## 머지 전 체크

- [ ] `pnpm --filter back lint && pnpm --filter back typecheck` 통과
- [ ] 새 엔드포인트에 DTO + 권한 데코레이터 둘 다 있는가
- [ ] 회사 자원이면 `companyId` 필터가 쿼리에 들어갔는가
- [ ] 스키마 변경이면 `db:generate`로 마이그레이션 SQL 만들고 커밋했는가
- [ ] 파일 I/O는 `STORAGE` 토큰 경유인가
