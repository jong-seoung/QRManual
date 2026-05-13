# skill — Next.js 클린 아키텍처

출처: [`nikolovlazar/nextjs-clean-architecture`](https://github.com/nikolovlazar/nextjs-clean-architecture) (GitHub ★847, 동명의 비디오 튜토리얼 동반). 이 프로젝트(`front/`)에 점진적으로 적용한다 — 한 번에 전체 리팩토링하지 말 것.

## 1. 레이어 (의존 방향: 바깥 → 안)

| # | 레이어 | 위치 | 책임 | 의존 |
| --- | --- | --- | --- | --- |
| 1 | **Frameworks & Drivers** | `front/app/` | Next.js pages, server actions, components, styles. 외부 진입점. | Controllers / Models / Errors만 사용 |
| 2 | **Interface Adapters** | `front/src/interface-adapters/` | Controllers (입력 검증·인증 체크·use case orchestration), Presenters (UI 친화 포맷 변환), 에러 핸들링 | Application |
| 3 | **Application** | `front/src/application/` | Use cases (단일 비즈니스 동작), Repository·Service **인터페이스** | Entities |
| 4 | **Entities** | `front/src/entities/` | Domain 모델, 프레임워크 독립적인 Custom Errors, Enterprise Business Rules | — |
| 5 | **Infrastructure** | `front/src/infrastructure/` | Repository/Service **구현체** (DB, 외부 API, 인증). DI 컨테이너 바인딩 | Application 인터페이스 구현 |

**Dependency Rule**: 안쪽 레이어는 바깥 레이어를 import 금지. `eslint-plugin-boundaries`로 강제 가능.

## 2. 폴더 구조 목표

```
front/
├── app/                       # Frameworks & Drivers (Next.js App Router)
├── src/
│   ├── application/           # use-cases/, *.interface.ts (repos/services)
│   ├── entities/              # models/, errors/
│   ├── infrastructure/        # repositories/, services/
│   └── interface-adapters/    # controllers/, presenters/
├── di/                        # DI 컨테이너 (ioctopus 권장)
├── drizzle/                   # 스키마/마이그레이션
└── tests/unit/                # src/ 구조를 미러링
```

## 3. 핵심 원칙

- **Inversion of Control**: 인터페이스는 Application에서 정의, 구현은 Infrastructure에서. 런타임에 DI 컨테이너가 주입 → 상위 레이어가 인프라 코드를 import하지 않게.
- **Controllers**는 검증/오케스트레이션만. 비즈니스 로직 금지.
- **Use Cases**는 권한 확인까지. **다른 use case를 호출하지 않는다** (호출하면 분리 신호).
- **Repository**는 단일 DB 동작(getTodo, createTodo, updateTodo)만 노출. 조합은 use case에서.
- **Services**는 외부 통합 + 공통 기능.
- **Models**는 plain JS/TS. DB 라이브러리 의존 금지.
- **Custom Errors**는 프레임워크 예외를 감싸 독립성 유지.

## 4. DI 라이브러리

`ioctopus` 권장 (Inversify.js 대신). 이유: `reflect-metadata` 불필요 → 서버리스/Edge 런타임 호환. 심볼로 repos/services/controllers/use cases를 바인딩.

## 5. 도입 전략 (이 프로젝트)

저자 권고: 신규 프로젝트에 즉시 도입 비추. 도입 시점은 **기능이 늘고·사용자가 늘고·팀이 커질 때**. 이 프로젝트는 이미 어느 정도 규모가 있으므로 **점진적 마이그레이션** 권장:

1. **새 기능부터** 5개 레이어 구조에 맞춰 작성 (기존 코드는 그대로 두고).
2. 자주 손대는 도메인부터 entities → application → infrastructure 순으로 분리.
3. route handler/server action은 controllers를 호출만 — 비즈니스 로직 직접 작성 금지.
4. DI 도입은 첫 controller 작성 시점에. 그 전엔 직접 import으로 시작해도 OK.

## 6. 머지 전 체크

- [ ] 새 파일이 위 5개 레이어 중 하나에 정확히 속하는가
- [ ] Application 이 Infrastructure를 import하지 않는가
- [ ] Use case가 다른 use case를 호출하지 않는가
- [ ] DB 라이브러리 타입이 entities/models에 새지 않았는가
- [ ] Controller에 비즈니스 분기가 없는가
