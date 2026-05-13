# skill — NestJS 클린 아키텍처

출처: [`royib/clean-architecture-nestJS`](https://github.com/royib/clean-architecture-nestJS) (GitHub ★927). Robert C. Martin Clean Architecture를 NestJS+TypeScript에 적용한 구현. 이 프로젝트(`back/`)에 **점진적으로** 적용한다.

> "This layer is where all the details go. The Web is a detail. The database is a detail." — 저자

## 1. 레이어 (의존 방향: 바깥 → 안)

| # | 레이어 | 위치 (`back/src/`) | 책임 |
| --- | --- | --- | --- |
| 1 | **Entities** (innermost) | `domain/entities/` | 비즈니스 엔티티. 프레임워크/DB 독립 |
| 2 | **Use Cases** | `application/use-cases/` | 단일 비즈니스 요구사항 한 개씩. 프레임워크/DB 독립 |
| 3 | **Controllers & Presenters** | `presentation/` | use case 진입/출구. 외부 입력과 비즈니스 로직 사이 어댑터 |
| 4 | **Frameworks** (outermost) | `infrastructure/` | NestJS 모듈/Drizzle/외부 서비스. 모든 *디테일*이 여기 |

**Dependency Rule**: 의존은 안쪽으로만. 바깥 레이어가 안쪽을 import하지, 그 반대 금지.

## 2. 영향받은 아키텍처

- **Hexagonal Architecture** (ports and adapters)
- **Onion Architecture** (concentric layers)
- **Screaming Architecture** (코드 구조가 비즈니스 의도를 *외친다* — 기술 스택이 아니라 도메인 폴더가 최상위)
- **SOLID**

## 3. 폴더 구조 목표

```
back/src/
├── domain/
│   └── entities/              # 순수 TS 클래스/타입. 데코레이터·DB 모듈 import 금지
├── application/
│   ├── use-cases/             # 1 use case = 1 파일. 입력/출력 타입 명시
│   ├── ports/                 # repository/service 인터페이스 (Hexagonal "ports")
│   └── dto/                   # use case 입출력 DTO (class-validator 가능)
├── presentation/
│   ├── controllers/           # @Controller. use case 주입받아 호출만
│   └── presenters/            # 응답 직렬화 (필요 시)
└── infrastructure/
    ├── persistence/           # Drizzle repository 구현
    ├── adapters/              # 외부 서비스 (메일, S3, OAuth 등)
    ├── modules/               # NestJS Module 묶기
    └── config/                # ConfigModule, env 검증
```

도메인 모듈 단위(예: `auth/`, `manuals/`)로도 위 4-레이어를 *수직 슬라이스*로 두는 변형 가능. 슬라이스 수가 적을 때는 위처럼 수평으로 시작.

## 4. 핵심 원칙

- **비즈니스 로직 우선** — 폴더 트리 최상위는 *기술*이 아니라 *도메인* 이름 (auth, manuals, parts...).
- **Use Case = 단일 동작** — Login, RegisterUser, ListManuals... 하나의 클래스/함수가 하나의 비즈니스 작업.
- **Port/Adapter** — `application/ports/`에서 인터페이스 선언, `infrastructure/`에서 구현. NestJS DI가 토큰으로 주입.
- **Controllers는 얇게** — Body 검증(`class-validator`) + use case 호출 + presenter 통과. 분기·트랜잭션·도메인 검증 금지.
- **Entities는 순수** — Drizzle column 타입, NestJS 데코레이터 등 외부 의존성 금지. 이 레이어를 보면 도메인 모델이 *외쳐야* 한다.

## 5. 도입 전략 (이 프로젝트)

저자는 reference 구현을 강조. 이 프로젝트는 이미 NestJS 모듈 구조로 동작 중이므로:

1. **새 기능부터** 위 4-레이어 구조로 작성.
2. 자주 손대는 모듈(예: `auth/`, `manuals/`)부터 entities → use-cases → ports → 기존 코드 이전.
3. NestJS Module은 `infrastructure/modules/`에 모으되, controllers는 `presentation/`에 두고 module이 import.
4. Drizzle schema는 `infrastructure/persistence/schema/`로 이동, entities는 schema와 분리된 순수 TS로.

## 6. 머지 전 체크

- [ ] 새 파일이 4개 레이어 중 하나에 명확히 속하는가
- [ ] `domain/entities/`에 NestJS/Drizzle import이 없는가
- [ ] Use case가 NestJS 데코레이터에 의존하지 않는가 (DI는 생성자 주입으로 충분)
- [ ] Controller에 비즈니스 분기/DB 호출이 없는가
- [ ] Port는 application/ports에 선언되고 infrastructure/에서 구현되는가
