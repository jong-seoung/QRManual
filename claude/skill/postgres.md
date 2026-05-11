# skill/postgres.md — DB (PostgreSQL) 영역

이 영역의 **단일 출처(SSoT)**. 채택 스킬, 컨벤션, 결정을 한 곳에 모은다.
Claude는 DB·스키마·쿼리 관련 작업 전 이 파일을 먼저 훑는다.

> **디폴트**: 단일 VM 내 self-hosted PostgreSQL 컨테이너 (CLAUDE.md §3).
> 기존 `Backend/docker-compose.yml`이 이미 `postgres:16-alpine`을 띄우고 있어 이 결정과 일치.

---

## 1. 운영 모델

### self-hosted PostgreSQL (Docker 컨테이너)

| 항목 | 값 |
| --- | --- |
| **이미지** | `postgres:16-alpine` (기존 Backend/docker-compose.yml과 동일) |
| **외부 스킬** | 없음 — `docker-compose.yml` 표준 정의로 충분 |
| **운영 모델** | VM 내 컨테이너. VM 라이프사이클과 함께. 콜드스타트 없음 |
| **백업** | `pg_dump` cron 일 1회 → 외부 객체 스토리지(S3/B2/Azure Blob), 7일 보관, 매주 복구 검증 |
| **연결** | 같은 Compose 네트워크 내부 통신 (`postgres:5432`). 운영에서 외부 노출 X |
| **특징** | 비용 = VM 포함 추가 0, 풀 컨트롤, 인수 시 `pg_dump` 한 번으로 끝 |

> Neon / Azure 매니지드 PostgreSQL은 *옵션*. 99.9%+ SLA 명시, HA 필수, 컴플라이언스 매니지드 요구 등이 생기면 ADR로 분기.

---

## 2. 컨벤션

### 2.1 스키마
- 테이블·컬럼 `snake_case`, TS 코드는 `camelCase` (TypeORM `@Column({ name: ... })` 또는 namingStrategy)
- 시간 컬럼은 `timestamptz`(시간대 포함). UTC 저장
- PK는 `bigint generated always as identity` 또는 `uuid default gen_random_uuid()` (URL 노출 시 uuid)
- QRManual 매뉴얼 ID는 **uuid** 권장 (QR URL에 노출됨, sequential ID는 추측 위험)
- 모든 테이블에 `created_at`, `updated_at` 표준
- 외래키는 `on delete cascade` / `on delete set null` 명시 (디폴트 no action 금지)

### 2.2 마이그레이션 (Drizzle — `nest.md` §3 확정)
- 스키마는 `back/src/db/schema.ts` (또는 `back/src/db/schema/*.ts` 도메인별 분할). 단일 출처
- `drizzle-kit generate` — 스키마 변경 → 마이그레이션 SQL 자동 생성 (`back/drizzle/` 폴더)
- `drizzle-kit migrate` — 마이그레이션 적용 (운영은 컨테이너 entrypoint에서)
- `drizzle-kit push`는 **dev 환경 한정** — 마이그레이션 파일 없이 직접 푸시. PR에는 항상 generate된 SQL이 동반
- drizzle은 자동 down이 없어 필요 시 수동 down SQL 추가
- 운영 DB에 직접 SQL 실행 금지 (CLAUDE.md §1.4)

### 2.3 쿼리
- N+1 방지 — TypeORM `relations` 또는 query builder의 join 적극 활용
- 페이지네이션 — keyset(cursor) 우선, offset은 작은 데이터셋에만
- 인덱스 — 외래키, 자주 필터/정렬되는 컬럼은 명시적 인덱스
- 매뉴얼 조회는 `slug`/`uuid`로 — 해당 컬럼 unique 인덱스
- 트랜잭션 — 다중 테이블 변경은 반드시 트랜잭션으로 묶음

### 2.4 시크릿
- `DATABASE_URL` 또는 분리된 `DB_HOST`/`DB_USERNAME`/`DB_PASSWORD`/`DB_NAME` — 서버에서만, 절대 프론트 X
- 기존 Backend는 분리 변수(`DB_USERNAME`/`DB_PASSWORD`/`DB_NAME`) 사용 중 — NestJS도 동일 키 유지하면 마이그레이션 단순
- `.env.example`에 키 이름만, 값 X (CLAUDE.md §1.4 시크릿 정책)
- 환경별 분리: `.env.development`, `.env.production` (커밋 안 함)

### 2.5 데이터 마이그레이션 (구→신)
- 기존 Spring JPA 엔티티가 만든 스키마는 그대로 유지
- Drizzle `schema.ts`가 *같은* 스키마를 매핑하도록 컬럼명·타입 정확히 맞춤 (snake_case 컬럼명, `pgTable("users", { ... })` 형식)
- 첫 단계: `drizzle-kit introspect`로 기존 DB에서 스키마 추출 → `schema.ts` 초안 생성 → 직접 정리
- 검증: 같은 DB에 신·구 백엔드를 번갈아 띄워 데이터가 양쪽 다 정상 읽히는지 확인

---

## 3. 이 프로젝트의 결정 메모

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-05-09 | **DB 호스팅 — self-hosted Docker 컨테이너 (단일 VM)** | CLAUDE.md §3. dev=prod 동일 명세, 비용 정액, 인수 단순 |
| 2026-05-09 | **이미지 — `postgres:16-alpine`** | 기존 `Backend/docker-compose.yml`과 일치, 변경 사유 없음 |
| 2026-05-09 | **로컬 개발 DB — Docker Compose** (디폴트와 동일) | dev/prod 둘 다 같은 이미지 |
| 2026-05-09 | **백업 — `pg_dump` cron 일 1회 + 외부 객체 스토리지** | 7일 보관, 매주 복구 검증 |
| 2026-05-09 | **PK — uuid (특히 매뉴얼·QR 등 URL 노출 엔티티)** | QR URL 추측 방지 |
| 2026-05-09 | **시간 컬럼 — `timestamptz`, UTC 저장** | 다국어 서비스 가능성 고려 |
| 2026-05-09 | **ORM — Drizzle (확정)** | 가벼움, SQL 친화, 타입 안전. JPA 엔티티는 `schema.ts`에 수동 매핑 |
| 2026-05-09 | **마이그레이션 도구 — `drizzle-kit generate` / `migrate`. dev에서 `push`는 가능하나 PR에는 generate된 SQL 동반** | 의도 명확한 마이그레이션 강제 |
| (외주 무관) | **운영 DB에 직접 SQL 실행 금지** | CLAUDE.md §1.4 |
| (예정) | 환경 분리 — dev / staging / prod 각각 다른 DB? | 단일 VM이면 보통 prod 1개 + 로컬 dev. staging 필요 시 별도 컨테이너 |
| (예정) | Redis 사용 범위 확정 후 그 데이터의 영속화 정책 | `nest.md` §3 미정 항목과 연동 |

---

## 4. 자체 스킬 (DB 영역)

작업 단위 자동화는 `.claude/skills/`에 위치:

| 스킬 | 위치 | 상태 |
| --- | --- | --- |
| `add-table` | `.claude/skills/add-table/` | 미작성 — 엔티티 + 마이그레이션 + 인덱스 + 모듈 등록 한 세트 |
| `add-migration` | `.claude/skills/add-migration/` | 미작성 |
| `seed-data` | `.claude/skills/seed-data/` | 미작성 — dev 환경 시드 데이터 |
| `port-jpa-entity` | `.claude/skills/port-jpa-entity/` | 미작성 — 옛 Spring JPA 엔티티 → Drizzle `schema.ts` 변환 |
