# web

**G-NooN in Weather** 프로덕션 Next.js(App Router) 앱입니다.

## 개발 실행

```bash
# 루트에서
pnpm --filter web dev

# 또는 이 디렉터리에서
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 확인할 수 있습니다.

## 환경 변수

`.env.example`을 복사해 `.env.local`을 만듭니다.

```bash
cp .env.example .env.local
```

| 변수                       | 필수 | 설명                                                                 |
| -------------------------- | ---- | -------------------------------------------------------------------- |
| `WEATHER_API_BASE_URL`     | ✅   | WeatherAPI 베이스 URL (예: `https://api.weatherapi.com/v1`)          |
| `WEATHER_API_KEY`          | ✅   | WeatherAPI 키                                                        |
| `KAKAO_LOCAL_API_BASE_URL` | ✅   | 카카오 Local REST 베이스 URL (예: `https://dapi.kakao.com/v2/local`) |
| `KAKAO_REST_API_KEY`       | ✅   | 카카오 REST API 키 (서버)                                            |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | ✅   | 카카오 Maps JavaScript SDK 키 (클라이언트)                           |
| `NAVER_API_BASE_URL`       | ✅   | 네이버 Open API 베이스 URL (예: `https://openapi.naver.com/v1`)      |
| `NAVER_CLIENT_ID`          | ✅   | 네이버 애플리케이션 Client ID                                        |
| `NAVER_CLIENT_SECRET`      | ✅   | 네이버 애플리케이션 Client Secret                                    |
| `MONGODB_URI`              | ✅   | MongoDB 연결 URI                                                     |
| `AUTH_SECRET`              | ✅   | 세션 JWT 서명 시크릿                                                 |

`NODE_ENV`는 Next.js가 자동으로 설정합니다. 프로덕션에서는 세션 쿠키 `secure` 옵션이 활성화됩니다.

## 라우트

| 경로                          | 설명                              |
| ----------------------------- | --------------------------------- |
| `/`                           | 홈 — 현재 위치 날씨, 예보, 레이더 |
| `/weather-news`               | 기상 뉴스 피드                    |
| `/theme-maps`                 | 테마 지도 목록                    |
| `/theme-maps/airports`        | 공항 테마 지도                    |
| `/theme-maps/airports/[iata]` | 공항 상세                         |
| `/theme-maps/baseball`        | 야구장 테마 지도                  |
| `/theme-maps/baseball/[id]`   | 야구장 상세                       |
| `/sign-in`, `/sign-up`        | 로그인·회원가입                   |
| `/my`                         | 마이페이지                        |

## 프로덕션 빌드

```bash
pnpm build   # 이 디렉터리에서
pnpm start
```

루트에서:

```bash
pnpm --filter web build
pnpm --filter web start
```

## 배포 (Vercel)

모노레포에서 이 앱만 배포할 때 권장 설정:

| 항목           | 값                                          |
| -------------- | ------------------------------------------- |
| Root Directory | `apps/web`                                  |
| Build Command  | `cd ../.. && pnpm turbo build --filter=web` |

위 [환경 변수](#환경-변수) 표의 값을 Vercel 프로젝트에 등록합니다.  
`turbo.json`의 `globalEnv`에 선언된 변수는 Turborepo 빌드 캐시 무효화에도 사용됩니다.

## 아키텍처

폴더 역할·데이터 흐름·`_components` 사용 이유, **service/loader·`.server.ts` 레이어 규칙**은 **[ARCHITECTURE.md](./ARCHITECTURE.md)** 를 참고하세요.

## 주요 디렉터리

```
app/           # 라우트, SSR, API Route
app/_components/   # 페이지 전용 client 조합기
features/      # 도메인 UI (home, weather, theme-maps, …)
components/    # 앱 전역 공통 UI
services/      # 외부 API 호출 (service, loader)
hooks/         # 클라이언트 훅
lib/           # 도메인 모듈 (auth, location, weather, …)
```

## 스타일 시스템

- 공통 Tailwind v4 토큰: `@shared/tailwind-config` (`theme.css` / `base.css`)
- 폰트: Pretendard 우선 스택

## 참고

- [ARCHITECTURE.md](./ARCHITECTURE.md) — 디렉터리 구조 가이드
- [../../docs/CODING_GUIDELINES.md](../../docs/CODING_GUIDELINES.md) — 코딩 컨벤션
- [../../README.md](../../README.md) — 모노레포 전체 가이드
- [Next.js 문서](https://nextjs.org/docs)
