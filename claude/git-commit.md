# git-commit — Git 커밋 컨벤션 (QRManual)

이 저장소의 커밋 메시지 표준.

> **방침**: Conventional Commits 형식(영어 prefix) + 한국어 subject·본문 + commitlint 자동 검증.
> 영어 prefix는 표준 도구·CI와 호환, 한국어는 가독성·인수에 유리.

---

## 1. 형식

```
<type>(<scope>): <subject>

<body (선택)>

<footer (선택)>
```

### 1.1 type (필수)

| type | 의미 | 예 |
| --- | --- | --- |
| `feat` | 새 기능 | `feat(front): 매뉴얼 뷰어 페이지 추가` |
| `fix` | 버그 수정 | `fix(back): JWT 만료 처리 누락 수정` |
| `docs` | 문서만 변경 (코드 변경 없음) | `docs: README 실행 절차 보강` |
| `style` | 포맷·세미콜론 등 (동작 변화 없음) | `style: prettier 일괄 적용` |
| `refactor` | 동작 변화 없는 구조 개선 | `refactor(back): ProductService 책임 분리` |
| `test` | 테스트 추가·수정 | `test(front): 매뉴얼 뷰어 e2e 추가` |
| `chore` | 빌드·설정·잡일 | `chore: husky pre-commit 설정` |
| `perf` | 성능 개선 | `perf(back): 상품 목록 N+1 제거` |
| `build` | 빌드 시스템·의존성 | `build: NestJS 11 업그레이드` |
| `ci` | CI 설정 | `ci: GitHub Actions e2e 워크플로 추가` |
| `revert` | 이전 커밋 되돌리기 | `revert: feat(front): 매뉴얼 뷰어 페이지 추가` |

`feat`·`fix`만으로 안 잡히면 위에서 가장 가까운 type 선택. 모호하면 `chore`.

### 1.2 scope (선택, 권장)

영역 표시. 마이그레이션 진행 중에는 신구가 공존하므로 *어디 영향을 주는지* 구분 가치가 더 크다.

표준 scope:

| scope | 영역 |
| --- | --- |
| `front` | `front/` (Next.js — 마이그레이션 후) |
| `back` | `back/` (NestJS — 마이그레이션 후) |
| `legacy-front` | `Frontend/` (구 Vite — 점차 제거) |
| `legacy-back` | `Backend/` (구 Spring — 점차 제거) |
| `db` | DB 스키마·마이그레이션 |
| `infra` | docker-compose, nginx, CI, 배포 스크립트 |
| `design` | 디자인 토큰·공용 UI 컴포넌트 |
| `claude` | `claude/` 메타 가이드 |
| `deps` | 의존성 일괄 업데이트 |

여러 영역이 동시에 바뀌는 큰 변경은 **scope 없이** 또는 분할 커밋. 한 커밋 = 한 논리적 변경 (CLAUDE.md §1.3).

### 1.3 subject (필수)

- **한국어**, 50자 이내
- 마침표(`.`) **금지**
- 동사 명령형 톤이지만 한국어 자연스럽게 — "추가", "수정", "정리", "변경"
- "~함", "~했음" 같은 과거형 회피
- 무엇을 했는지가 한 줄로 보이게

| 좋은 예 | 나쁜 예 |
| --- | --- |
| `feat(front): 매뉴얼 뷰어 페이지 추가` | `update` (type·내용 없음) |
| `fix(back): 토큰 만료 시 401 응답 누락 수정` | `feat: 버그 고침` (type 오용 + 모호) |
| `chore: husky + commitlint 설정` | `chore: 여러 설정 추가했음.` (마침표·과거형) |

### 1.4 body (선택)

- subject 다음 **빈 줄** 한 줄 띄고 시작
- 한국어로 **왜** 변경했는지 (무엇은 diff로 보이니 이유에 집중)
- 한 줄당 72자 권장
- 불릿(`-`) 사용 가능

### 1.5 footer (선택)

- `Closes #N`, `Refs #N` — 이슈 연결
- `BREAKING CHANGE: <설명>` — API·스키마 호환성 깨짐 (한국어 가능)
- `Co-authored-by: Name <email>` — *사람* 공동 작업자만. AI 도구는 표기 안 함 (아래)

### 1.6 AI 도구 자동 표기 — **사용 안 함**

이 저장소에서는 AI 보조로 작성·수정된 커밋이라도 다음 자동 표기를 **추가하지 않는다**:

- `Co-Authored-By: Claude <noreply@anthropic.com>`
- `Co-Authored-By: Claude Opus / Sonnet / Haiku ...`
- `🤖 Generated with [Claude Code](...)`
- 그 외 동등한 AI 출처 마커

**근거**: 모든 커밋은 사용자 본인이 책임지고 검수한 커밋으로 통합한다. 도구 사용 여부는 커밋 이력의 신호로 두지 않는다.

**Claude 작업 시 주의**: 시스템/툴이 디폴트로 위 라인을 추가하려 해도 **이 룰이 우선**한다. 커밋 메시지 작성 시 해당 라인을 빼고 작성한다.

---

## 2. 예시

### 일반 기능 추가
```
feat(front): 매뉴얼 뷰어 페이지 추가

- App Router 기반 `/m/[id]` 라우트
- 서버 컴포넌트에서 매뉴얼 fetch
- 320/768/1280 viewport 검증 완료

Closes #42
```

### 마이그레이션 슬라이스
```
feat(back): 상품 모듈 NestJS로 포팅

기존 Spring ProductController/Service/Repository 동작을
NestJS ProductModule(controller + service + entity) 한 세트로 옮김.
DB 스키마는 그대로 유지, 엔드포인트 시그니처도 동일.

Refs #11
```

### 버그 수정
```
fix(back): JWT refresh 토큰 만료 시 401 누락 수정

기존엔 access만 만료 검사하고 refresh는 만료된 채로
새 access를 발급해 영구 세션이 발생함.
RefreshGuard에서 만료 검사 추가.

Refs #58
```

### 의존성 업데이트
```
build(deps): Next.js 15.1 → 15.2 업그레이드
```

### 메타 가이드 변경
```
docs(claude): skill/postgres.md TypeORM 결정 메모 추가
```

---

## 3. 작성 단위

- **한 커밋 = 한 논리적 변경** (CLAUDE.md §1.3)
- 큰 기능은 작은 커밋 시리즈로:
  1. `feat(db): 매뉴얼 테이블 스키마 추가`
  2. `feat(back): 매뉴얼 API 엔드포인트 추가`
  3. `feat(front): 매뉴얼 뷰어 페이지 추가`
- 동일 PR에 위 3개가 같이 들어가도 됨. 커밋 단위만 분리.
- 머지 전 정리(`git rebase -i`)로 의미 단위 다듬기 권장. **단 push된 공유 브랜치의 rewrite는 금지** (CLAUDE.md §1.4).

---

## 4. 자동 검증 — commitlint + husky

husky([`skill/lint-format.md`](./skill/lint-format.md)) 도입과 짝.

### 설치 (루트)
```bash
pnpm add -D -w @commitlint/cli @commitlint/config-conventional
```

### `commitlint.config.cjs` (루트)
```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", "style", "refactor",
      "test", "chore", "perf", "build", "ci", "revert"
    ]],
    "scope-enum": [1, "always", [
      "front", "back", "legacy-front", "legacy-back",
      "db", "infra", "design", "claude", "deps"
    ]],
    "subject-case": [0],     // 한국어 subject 허용
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 72],
  },
};
```

### `.husky/commit-msg`
```sh
pnpm exec commitlint --edit "$1"
```

### 우회 금지
`--no-verify`로 훅 건너뛰지 않음 (CLAUDE.md §1.4). 검증 실패 시 메시지를 고친다.

---

## 5. 자주 헷갈리는 케이스

| 상황 | 권장 type |
| --- | --- |
| README 오타 수정 | `docs` |
| 코드 안 주석만 수정 | `docs` (또는 `chore`) |
| 변수명 변경 (동작 동일) | `refactor` |
| 사용 안 하는 코드 삭제 | `refactor` 또는 `chore` |
| 마이그레이션 완료된 옛 폴더 제거 (`Backend/` 삭제) | `chore` (큰 변경이면 PR 분리) |
| `.gitignore`·`.prettierrc` 변경 | `chore` |
| 패키지 추가만 (코드 없음) | `build(deps)` |
| 패키지 추가 + 그것을 쓰는 코드 | `feat`/`fix`/등 (실제 변경의 type) |
| ADR 추가 | `docs(claude)` |

---

## 6. 결정 메모

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-05-09 | **Conventional Commits 형식 채택, 한국어 subject·body** | 표준 도구 호환 + 한국어 가독성 |
| 2026-05-09 | **commitlint + husky `commit-msg` 훅으로 자동 검증** | 일관성 강제 |
| 2026-05-09 | **scope는 권장(선택), `legacy-front`·`legacy-back` 추가** | 마이그레이션 기간에 신구 구분 가치 큼. 마이그레이션 끝나면 두 scope 제거 |
| 2026-05-09 | **subject 마침표 금지, 50~72자 헤더 길이** | git log 가독성 |
| 2026-05-09 | **AI 자동 표기(`Co-Authored-By: Claude ...`, `🤖 Generated with...`) 사용 안 함** | 모든 커밋은 사용자 본인 책임 |
