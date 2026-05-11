# skill/lint-format.md — Lint / Format / Alias 영역

이 영역의 **단일 출처(SSoT)**. ESLint, Prettier, 절대경로 alias, pre-commit 훅 표준을 한 곳에 모은다.
`front/`·`back/` 양쪽에 적용.

---

## 1. 채택한 외부 스킬

없음 — 자체 컨벤션. 개별 도구의 공식 문서를 따르되, 이 파일 §2가 설정의 단일 출처다.

---

## 2. 컨벤션

### 2.1 ESLint

**구성**:
- `front/`: `eslint-config-next` (Next.js 공식)
- `back/`: NestJS CLI가 만들어주는 `@typescript-eslint` 기본
- **flat config 사용** — `eslint.config.js` (Next 15·NestJS 11 모두 지원)

**추가 플러그인 (front·back 공통)**:
- `eslint-plugin-unused-imports` — 미사용 import 자동 제거
- `eslint-plugin-import` — import 순서 강제

**금지**:
- airbnb 같은 풀 프리셋 — 도입 비용 크고, 의견 강한 룰이 협업 마찰 만듦
- 포맷팅 관련 ESLint 룰 — Prettier가 처리. `eslint-config-prettier`로 비활성화 필수

**스크립트** (각 `package.json`):
```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

### 2.2 Prettier

**채택 이유**: ESLint는 코드 품질, Prettier는 포맷팅 — 책임 분리. 둘 충돌은 `eslint-config-prettier`로 해결.

**설정 — 루트 `.prettierrc` (front/back 공통)**:
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**`.prettierignore`** (루트):
```
node_modules
.next
dist
coverage
pnpm-lock.yaml
Backend
Frontend
```

> `Backend/`·`Frontend/`는 마이그레이션 동안 옛 코드라 Prettier 적용 안 함. 마이그레이션 끝나고 폴더 제거 시 ignore도 정리.

**스크립트** (각 `package.json` 또는 루트):
```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

### 2.3 절대경로 alias

**front/ (Next.js)**:
- `front/tsconfig.json`의 `compilerOptions.paths`에 `"@/*": ["./src/*"]`
- `src/` 디렉터리 사용 시 위 그대로. `src/` 안 쓰면 `["./*"]` (Next.js create-next-app 옵션 그대로)

**back/ (NestJS)**:
- `back/tsconfig.json`에 `"@/*": ["src/*"]`
- 빌드 시 alias 해석을 위해 `tsconfig-paths` 또는 SWC `paths` 옵션. NestJS 11+는 SWC로 자동 처리.

**원칙**:
- 두 폴더 모두 prefix는 **`@/`** — 각 프로젝트 내부 경로라 외부 import와 헷갈리지 않음
- 상대경로(`../../../`)는 **2단계 이상이면 `@/`로 변경** 권장
- 같은 폴더 내(`./Component`)는 상대경로 그대로

### 2.4 pre-commit 훅 — husky + lint-staged

**채택 이유**: 커밋 시점에 자동 포맷·린트 fix를 강제해, "포맷팅 미스매치 PR" 자체를 막음.

**설치 (루트)**:
```bash
pnpm add -D -w husky lint-staged
pnpm husky init
```

**`.husky/pre-commit`**:
```sh
pnpm lint-staged
```

**루트 `package.json`**:
```json
"lint-staged": {
  "front/**/*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "back/**/*.{ts,js}": ["eslint --fix", "prettier --write"],
  "**/*.{json,md,yml,yaml}": ["prettier --write"]
}
```

> 옛 `Frontend/`·`Backend/`는 lint-staged 패턴에서 의도적으로 제외 — 마이그레이션 동안 건드리는 양 적고, 옛 컨벤션 살림.

**우회 금지**: `--no-verify`로 훅 건너뛰지 않는다 (CLAUDE.md §1.4). 훅이 실패하면 원인을 고친다.

### 2.5 패키지 매니저 / 워크스페이스

- 루트에 `pnpm-workspace.yaml`로 `front/`·`back/`을 워크스페이스로 묶을지 검토 (디폴트 채택 후보)
- 채택 시 루트 `package.json`에 `lint-staged`·`commitlint`·`husky` 등 *공통 도구만* 위치
- 각 워크스페이스는 자체 `package.json` 유지

---

## 3. 이 프로젝트의 결정 메모

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-05-09 | **ESLint = `eslint-config-next` (front) + NestJS CLI 디폴트 (back), flat config** | 공식 권장, 도입 비용 최소 |
| 2026-05-09 | **추가 플러그인: `eslint-plugin-unused-imports`, `eslint-plugin-import`** | 적당한 강도, 강한 프리셋(airbnb 등)은 마찰 큼 |
| 2026-05-09 | **Prettier 채택, `eslint-config-prettier`로 충돌 비활성화** | 코드 품질(ESLint)과 포맷팅(Prettier) 책임 분리 |
| 2026-05-09 | **Prettier 옵션 — `printWidth: 100`, `semi: true`, `singleQuote: false`, `trailingComma: "all"`, `tabWidth: 2`** | 가독성 + JS 생태계 표준 따옴표(`"`) |
| 2026-05-09 | **절대경로 alias = `@/*` (front/back 공통, 각자 `src/`)** | 둘 다 같은 prefix로 일관성 |
| 2026-05-09 | **husky + lint-staged 포함** | 커밋 자동 포맷 |
| 2026-05-09 | **`.prettierrc`·husky 설정은 루트** | front/back 공통이라 단일 출처 유지 |
| 2026-05-09 | **옛 `Frontend/`·`Backend/`는 lint/format 대상에서 제외** | 마이그레이션 동안 옛 컨벤션 살림. 폴더 제거 시 함께 정리 |
| (예정) | pnpm 워크스페이스 채택 여부 | front/back 동시 관리 효용 평가 후 |

---

## 4. 자체 스킬 (Lint/Format 영역)

| 스킬 | 위치 | 상태 |
| --- | --- | --- |
| `setup-lint-format` | `.claude/skills/setup-lint-format/` | 미작성 — 새 프로젝트 셋업 시 ESLint/Prettier/husky를 한 번에 깔아주는 스킬 후보 |
