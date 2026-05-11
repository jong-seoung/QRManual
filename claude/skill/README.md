# skill/

기술 영역별 단일 출처(SSoT). 각 파일이 "이 영역에서 우리가 어떻게 일하나"를 통합한다.

영역 파일 = **외부 스킬 채택 정보 + 컨벤션 + 결정 메모**를 한 곳에. 영역 단위로 보면 끝.

## 구성

| 파일 | 영역 | 채택 외부 스킬 |
| --- | --- | --- |
| [`next.md`](./next.md) | 프론트엔드 (Next.js) | `next-best-practices` (Vercel Labs) |
| [`nest.md`](./nest.md) | 백엔드 (NestJS) | `nestjs-best-practices` (kadajett) |
| [`postgres.md`](./postgres.md) | DB (PostgreSQL) | self-hosted (단일 VM 컨테이너) |
| [`nginx-docker.md`](./nginx-docker.md) | Reverse Proxy / Compose | 없음 — 자체 컨벤션 |
| [`lint-format.md`](./lint-format.md) | Lint / Format / Alias (front·back 공통) | 없음 — 자체 컨벤션 |
| `tailwind.md` (예정) | 스타일링 | 미정 — `claude/design.md`와 책임 분담 필요 |
| `testing.md` (예정) | 테스트 (Vitest / Playwright) | 미정 |

## 새 영역 파일을 추가할 때

1. 해당 영역의 외부 스킬을 검색 (skills.sh / GitHub) — 적합한 게 있나
2. 영역 파일 생성: `skill/<영역>.md`
   - §1 채택 외부 스킬 — 출처, 설치 명령, 호출 조건, 채택 근거
   - §2 컨벤션 — 1차 골격
   - §3 결정 메모 — 표로 누적
   - §4 자체 스킬 — `.claude/skills/`에 만들 자동화 후보
3. 외부 스킬 설치: `npx skills add <repo> --skill <name>`
4. 큰 결정은 `../architecture/adr/`에 ADR로 분리 (폴더는 첫 ADR 작성 시 생성)

## 영역 파일 vs 자체 스킬

| 종류 | 위치 | 분류 기준 |
| --- | --- | --- |
| **영역 파일** | `claude/skill/<영역>.md` | 기술 영역 (Next.js, NestJS, PostgreSQL, Nginx...) |
| **자체 스킬** | `.claude/skills/<name>/SKILL.md` | 작업 단위 (`add-page`, `add-nest-module`, `add-table`...) |

자체 스킬은 영역 경계를 넘는 경우가 많아 (`add-manual-section`은 Next.js + design + DB 양쪽 영향) 작업 단위로 둔다. 단, 어느 영역에 주로 속하는지는 해당 영역 파일 §4에 등록.

## 자체 스킬 SKILL.md 형식 (예시)

```markdown
---
name: add-nest-module
description: 새 NestJS 도메인 모듈(controller + service + entity + dto) 한 세트를 추가할 때 사용.
---

# add-nest-module

## 입력
- 모듈명, 핵심 엔티티 필드, 인증 필요 여부

## 절차
1. `back/src/<module>/<module>.module.ts` 생성
2. `*.controller.ts`, `*.service.ts`, `entities/*.entity.ts`, `dto/*.dto.ts` 생성
3. `app.module.ts`에 import 추가
4. Swagger 데코레이터 부착 (`@ApiTags`, `@ApiOperation`)
5. 단위 테스트 1개 (service happy path)
6. 커밋: `feat(back): <module> 모듈 추가`
```

## 외부 스킬 충돌 정책

같은 영역에 여러 외부 스킬이 충돌할 때:
1. 영역 파일 §3 결정 메모에 어느 쪽을 우선했는지 기록
2. 큰 충돌이면 ADR로 분리
