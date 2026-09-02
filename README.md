# G-NooN in Weather

위치 기반 날씨 정보, 테마 지도, 기상 뉴스를 제공하는 **Next.js 웹 서비스**입니다.  
Turborepo + pnpm 모노레포로 `apps/web`과 공유 패키지를 함께 관리합니다.

## 주요 기능

| 영역           | 설명                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| **홈**         | GPS·검색 기반 현재 위치 날씨, 시간별·일별 예보, 천문 일정, 날씨 레이더 |
| **테마 지도**  | 공항·야구장 등 테마 장소 지도와 실시간 날씨                            |
| **기상 뉴스**  | 언론사별 기상 뉴스 피드, 관심 언론 목록                                |
| **마이페이지** | 회원 정보, 즐겨찾는 위치·언론 목록 관리                                |

## 기술 스택

- **앱**: Next.js 16 (App Router), React 19, TypeScript
- **스타일**: Tailwind CSS v4, `@shared/tailwind-config` 디자인 토큰
- **UI**: `@shared/ui` (shadcn/ui 기반)
- **데이터**: MongoDB, WeatherAPI, Kakao Local/Maps, Naver Search API
- **빌드**: Turborepo, pnpm

## 사전 요구사항

- Node.js **18+** (CI는 Node 22 사용)
- [pnpm](https://pnpm.io/) **10.x** (`packageManager` 필드와 동일 버전 권장)

## 빠른 시작

```sh
git clone <repository-url>
cd gnoon-in-weather
pnpm install
```

환경 변수는 `apps/web/.env.example`을 참고해 `apps/web/.env.local`을 만듭니다.

```sh
cp apps/web/.env.example apps/web/.env.local
# 값을 채운 뒤
pnpm --filter web dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 확인할 수 있습니다.

## 모노레포 구성

| 경로                                                       | 설명                            |
| ---------------------------------------------------------- | ------------------------------- |
| [`apps/web`](apps/web)                                     | 프로덕션 Next.js 앱             |
| [`apps/storybook`](apps/storybook)                         | `@shared/ui` Storybook          |
| [`packages/ui`](packages/ui)                               | 공용 UI 컴포넌트                |
| [`packages/tailwind-config`](packages/tailwind-config)     | Tailwind v4 / PostCSS 공통 설정 |
| [`packages/eslint-config`](packages/eslint-config)         | ESLint 공통 설정                |
| [`packages/typescript-config`](packages/typescript-config) | TypeScript 공통 설정            |

## 스크립트

루트에서 전체 워크스페이스를 실행합니다.

```sh
pnpm dev           # 모든 앱 dev (web, storybook)
pnpm build         # 전체 빌드
pnpm lint          # 전체 lint
pnpm check-types   # 전체 타입 검사
pnpm format        # Prettier 포맷
```

개별 앱/패키지만 실행할 때는 `--filter`를 사용합니다.

```sh
pnpm --filter web dev
pnpm --filter storybook dev
pnpm --filter web build
```

## 환경 변수

`apps/web` 실행·빌드에 필요한 변수 목록은 [`apps/web/.env.example`](apps/web/.env.example)과 [`apps/web/README.md`](apps/web/README.md)를 참고하세요.

| 변수            | 용도                           |
| --------------- | ------------------------------ |
| `WEATHER_API_*` | WeatherAPI 날씨 데이터         |
| `KAKAO_*`       | 위치 검색·지도 (REST + JS SDK) |
| `NAVER_*`       | 기상 뉴스 검색                 |
| `MONGODB_URI`   | 회원·즐겨찾기 저장             |
| `AUTH_SECRET`   | 세션 JWT 서명                  |

## 배포

프로덕션 대상은 **`apps/web`** 입니다. [Vercel](https://vercel.com/) 기준 설정 예시는 아래와 같습니다.

| 항목             | 값                                           |
| ---------------- | -------------------------------------------- |
| Root Directory   | `apps/web`                                   |
| Framework Preset | Next.js                                      |
| Install Command  | `pnpm install` (모노레포 루트에서 자동 실행) |
| Build Command    | `cd ../.. && pnpm turbo build --filter=web`  |
| Output Directory | `.next` (기본값)                             |

배포 환경(Vercel 프로젝트 Settings → Environment Variables)에 `apps/web/.env.example`의 변수를 모두 등록합니다.  
`NEXT_PUBLIC_*` 변수는 빌드 시점에 번들에 포함되므로 Preview/Production 각각 설정해야 합니다.

로컬 프로덕션 빌드 확인:

```sh
pnpm --filter web build
pnpm --filter web start
```

## CI

`main` 브랜치로 향하는 Pull Request에서 lint, 타입 검사, 빌드를 실행합니다.  
워크플로: [`.github/workflows/test-pull-request.yml`](.github/workflows/test-pull-request.yml)

## 문서

| 문서                                                           | 설명                         |
| -------------------------------------------------------------- | ---------------------------- |
| [`apps/web/README.md`](apps/web/README.md)                     | web 앱 실행·환경 변수·라우트 |
| [`apps/web/ARCHITECTURE.md`](apps/web/ARCHITECTURE.md)         | 폴더 구조·데이터 흐름        |
| [`docs/README.md`](docs/README.md)                             | 문서 맵                      |
| [`docs/CODING_GUIDELINES.md`](docs/CODING_GUIDELINES.md)       | 코딩 가이드라인              |
| [`docs/APP_SETUP.md`](docs/APP_SETUP.md)                       | 새 앱 공통 초기 세팅         |
| [`docs/COMMIT_MESSAGE_GUIDE.md`](docs/COMMIT_MESSAGE_GUIDE.md) | 커밋 메시지 규칙             |
| [`AGENTS.md`](AGENTS.md)                                       | AI 에이전트 인덱스           |

## 외부 문서

- [Turborepo](https://turborepo.com/docs)
- [Next.js](https://nextjs.org/docs)
- [pnpm workspace](https://pnpm.io/workspaces)
