# apps/web 아키텍처 가이드

`apps/web`의 폴더 역할과 코드 배치 기준을 정리한 문서입니다.  
Next.js App Router 위에 **기능 단위 UI(`features/`)** 와 **공통 인프라(`services/`, `utils/` 등)** 를 나눈 구조입니다.

---

## 아키텍처 개요

페이지는 보통 아래 3단으로 구성합니다.

```
app/(with-footer)/page.tsx (Server)              ← 라우트 진입 (얇게)
  └─ _components/*.content.server.tsx (Server)   ← 쿠키·fetch·초기 데이터
       └─ _components/*.client.tsx (Client)      ← GPS·refetch·섹션 조합
            └─ features/*/sections, components   ← UI 조각 (props)
```

공통 코드는 기능(`features/`) 밖의 루트 폴더에 둡니다.

```
app/  features/  components/  services/  hooks/  lib/  utils/  types/  contexts/
```

| 폴더               | 한 줄 역할                                         |
| ------------------ | -------------------------------------------------- |
| `app/`             | 라우트, SSR, API Route, route group 레이아웃       |
| `app/_components/` | 페이지 전용 server/client 조합기                   |
| `features/`        | 도메인(홈, 날씨 등) UI · feature 전용 `lib/`       |
| `components/`      | 앱 전역 공통 UI                                    |
| `services/`        | 외부 API 호출 (service · loader · cache.server)    |
| `hooks/`           | 클라이언트 훅                                      |
| `lib/`             | 도메인 모듈(상수·규칙·쿠키·정규화) `lib/{domain}/` |
| `utils/`           | 순수·범용 헬퍼만 (`format`, `cookie` 등)           |
| `types/`           | 공유 타입                                          |
| `contexts/`        | 앱 전역 React Context (단위 표시 등)               |

---

## Route group · `_components`

### Route group

URL에 나타나지 않는 폴더로 레이아웃을 나눕니다.

| 그룹                            | 역할                                         |
| ------------------------------- | -------------------------------------------- |
| `app/(with-footer)/`            | 푸터 있는 일반 페이지 (홈, 뉴스, 마이, 인증) |
| `app/theme-maps/(with-footer)/` | 테마 지도 목록·상세 (푸터 있음)              |
| `app/theme-maps/(map)/`         | 지도 전체 화면 (푸터 없음)                   |
| `app/(with-footer)/(auth)/`     | 로그인·회원가입 등                           |

### `_components`는 왜 쓰나?

#### 1. Next.js 규칙

`_`로 시작하는 폴더는 **URL 라우트가 되지 않습니다.**  
`app/(with-footer)/_components/homepage.client.tsx`는 경로가 아니라, 해당 라우트 옆에 붙인 코드입니다.

#### 2. 역할 분리 (colocation)

한 페이지를 서버·클라이언트로 나눕니다.

| 파일                               | 실행 환경 | 담당                                      |
| ---------------------------------- | --------- | ----------------------------------------- |
| `page.tsx`                         | Server    | 라우트 진입 (보통 content를 렌더만)       |
| `_components/*.content.server.tsx` | Server    | 쿠키 읽기, loader fetch, 초기 데이터 준비 |
| `_components/*.client.tsx`         | Client    | `useState`, GPS, refetch, 섹션 조합       |

**feature UI**와 **페이지 조합기**를 분리하는 이유:

- feature 컴포넌트 → 재사용·테스트 가능한 UI 조각
- `*.content.server.tsx` / `*.client.tsx` → 그 페이지에서만 필요한 서버·client 경계

#### 네이밍

- `{페이지명}.content.server.tsx` — SSR 데이터 로드·조합
- `{페이지명}.client.tsx` — client 조합기
- 라우트가 깊어지면 해당 경로 아래 `_components/`에 둡니다.

```
app/(with-footer)/
├── page.tsx
└── _components/
    ├── homepage-content.server.tsx
    └── homepage.client.tsx

app/theme-maps/(map)/airports/
├── page.tsx
└── _components/
    └── airports.client.tsx
```

---

## 디렉터리별 역할

### `app/` — 라우트·서버 진입점

```
app/
├── layout.tsx                         # 전역 레이아웃
├── (with-footer)/
│   ├── layout.tsx                     # 푸터 레이아웃
│   ├── page.tsx                       # 홈 라우트
│   └── _components/
│       ├── homepage-content.server.tsx
│       └── homepage.client.tsx
├── theme-maps/
│   ├── (map)/…                        # 지도 전체 화면
│   └── (with-footer)/…                # 목록·상세
└── api/
    └── weather/route.ts               # 클라이언트 refetch용
```

**넣을 것**

- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- API Route (`route.ts`)
- **그 페이지에서만** 쓰는 `*.content.server.tsx` / `*.client.tsx`

**넣지 말 것**

- 여러 페이지에서 쓰는 UI
- 비즈니스 로직이 담긴 presentational 컴포넌트

---

### `features/` — 기능(도메인) 단위 UI

```
features/weather/                  # 여러 페이지에서 재사용하는 날씨 표시 UI
├── types/
│   └── weather-component.type.ts
├── sections/
│   ├── daily-weather.section.tsx
│   └── index.ts
└── components/
    ├── current-weather.tsx
    └── daily-weather-card.tsx

features/home/                     # 홈 전용 (GPS 위치, 검색)
├── types/
├── sections/
└── components/

features/favorite-press-list/      # 언론사 선호목록 공유 UI (편집·목록 아이템)
└── components/
    ├── favorite-press-list-edit-dialog.tsx
    ├── favorite-press-list-edit-form.tsx
    ├── favorite-press-list-edit-session.tsx
    └── favorite-press-lists-item.tsx
```

**`favorite-press-list` 역할**

- 마이페이지·기상 뉴스에서 **같이 쓰는** 선호목록 편집·목록 아이템 UI를 둡니다.
- `my` / `weather-news`는 각자 섹션·다이얼로그에서 이 feature를 **조합만** 합니다.
- 언론사 뱃지·선택 UI 같은 뉴스 도메인 프리미티브는 `weather-news/components`에 두고, 필요 시 `favorite-press-list`가 import합니다. (역방향: 뉴스 피드 → favorite-press-list 편집은 편집 세션 등 공유 UI에 한정)

**넣을 것**

- 특정 기능(홈, 테마지도 등)에만 쓰는 섹션·카드·테이블
- **2개 이상 feature/페이지에서 쓰는 날씨 UI** → `features/weather/`
- **2개 이상 페이지에서 쓰는 선호목록 편집 UI** → `features/favorite-press-list/`
- 섹션 파일: `*.section.tsx` + **`sections/index.ts` barrel** (섹션이 있는 feature마다 1개)

**섹션 barrel (`sections/index.ts`)**

- **용도:** `app/**/_components`, `page.tsx` 등 **외부 조합기**가 여러 섹션을 `@/features/{기능}/sections` 한 경로로 import
- **export 형식:** `export { default as XxxSection } from './xxx.section'` (named re-export)
- **형제 섹션**끼리 import할 때는 barrel을 쓰지 않고 **상대 경로** — 순환 참조 방지
- 섹션이 1개뿐인 feature(`auth`)도 barrel을 두어 import 경로를 통일

**규칙**

- 표시 데이터는 **props로** 받습니다.
- 섹션이 context를 직접 읽지 않도록 유지합니다. (단위 표시는 leaf/`WeatherUnitsProvider`에서 처리)
- `features/{기능}/types/` = **공개 계약(boundary contract)** — 섹션·client·page props
- **leaf 컴포넌트** props → 컴포넌트 파일 상단 인라인 `type`, **export 안 함**
- 앱 전역 API·도메인 타입 → `apps/web/types/`
- 상세: [`docs/CODING_GUIDELINES.md`](../../docs/CODING_GUIDELINES.md) § TypeScript

**타입 배치 요약**

| 대상                | 위치                              | 예                                            |
| ------------------- | --------------------------------- | --------------------------------------------- |
| 섹션 props          | `features/{기능}/types/`          | `ForecastDaysSectionProps`                    |
| client 조합기 props | 동일                              | `HomepageClientProps`                         |
| shared primitive    | 동일 (또는 cross-feature feature) | `CurrentWeatherProps`, `LocationControlProps` |
| leaf props          | 컴포넌트 파일 인라인              | `DailyWeatherCardProps`                       |
| API·공유 도메인     | `types/`                          | `WeatherSummary`                              |

---

### `components/` — 앱 전역 공통 UI

```
components/
├── header.tsx
├── footer.tsx
├── nav.tsx
└── …
```

**넣을 것**

- 2개 이상 feature/페이지에서 쓰는 UI (헤더, 푸터, 공통 카드 등)

---

### `contexts/` — 앱 전역 Context

```
contexts/
└── weather-units.context.tsx   # °C/°F 등 표시 단위
```

섹션은 context를 직접 읽지 않고, 단위가 필요한 leaf 컴포넌트·Provider 경계에서만 사용합니다.

---

### `services/` — 외부 API 호출

```
services/
├── weather.service.ts                 # WeatherAPI 직접 호출
├── weather.loader.ts                  # page + API route 공통 파사드
├── weather.loader.cache.server.ts     # SSR용 'use cache' 래퍼
├── kakao.service.ts / kakao.loader.ts
├── naver.service.ts / naver.loader.ts / naver.loader.cache.server.ts
├── favorite-*.service.ts / *.loader.ts / *.loader.cache.server.ts
└── auth.service.ts                    # 인증 (loader 없음 — 아래 예외)
```

**넣을 것**

- HTTP/API 호출, 외부 서비스 연동
- 서버·클라이언트 양쪽에서 쓰는 로더/파사드
- SSR 전용 Cache Components 래퍼 (`*.loader.cache.server.ts`)

**구분** — 상세는 [레이어 구분 패턴](#레이어-구분-패턴-serviceloaderserver) 참고

- `*.service.ts` — 저수준 API 클라이언트 (엔드포인트 1건)
- `*.loader.ts` — 여러 service를 묶은 앱용 파사드
- `*.loader.cache.server.ts` — loader 위에 `'use cache'` / `cacheTag`를 얹은 **서버 전용** 진입점

---

### `hooks/` — React 훅 (클라이언트)

```
hooks/
├── use-weather.ts              # 홈: GPS·검색 좌표 변경 시 refetch
└── use-favorite-press-lists.ts
```

feature 전용 훅은 `features/{name}/hooks/`에 둡니다.

- 예: `features/theme-maps/hooks/use-place-weather.ts` — 공항·야구장 상세 공통 (고정 좌표)

---

### `lib/` — 도메인 모듈 (`lib/{domain}/`)

앱 인프라·도메인 로직을 **도메인 폴더**로 묶습니다.

```
lib/
├── api-error.ts
├── weather/
│   ├── constants.ts
│   ├── units.ts / units-cookie.ts / units-cookie.server.ts
│   ├── split-forecast.ts
│   ├── is-realtime-stale.ts
│   ├── is-forecast-stale.ts
│   └── …
├── location/
├── kakao/
├── auth/
└── …
```

**`utils/`와 구분**

| `lib/{domain}/`                     | `utils/`          |
| ----------------------------------- | ----------------- |
| 도메인에 묶인 모듈(상수+I/O+정규화) | 순수·범용 헬퍼만  |
| `lib/weather/normalize-error.ts`    | `utils/format.ts` |
| `lib/location/resolve-home.ts`      | `utils/cookie.ts` |

**feature 전용 로직** — 한 feature UI에서만 쓰면 `features/{name}/lib/`에 둡니다.

---

### `utils/` — 순수·범용 헬퍼

```
utils/
├── format.ts
└── cookie.ts
```

도메인 변환·쿠키 정책·에러 매핑은 `lib/` 또는 `features/*/lib/`로 올립니다.  
`*.server.ts`는 보통 `lib/{domain}/` 안에 둡니다.

---

## 레이어 구분 패턴 (service · loader · server)

### `*.service.ts` vs `*.loader.ts` vs `*.loader.cache.server.ts`

| 구분   | `*.service.ts`              | `*.loader.ts`                           | `*.loader.cache.server.ts`           |
| ------ | --------------------------- | --------------------------------------- | ------------------------------------ |
| 역할   | 외부 API **엔드포인트 1건** | service를 **조합**해 화면/API 형태 반환 | loader를 SSR Cache Components로 감쌈 |
| 반환   | API 응답 타입 그대로        | 앱 도메인 타입 (`WeatherSummary` 등)    | loader와 동일                        |
| 사용처 | loader 내부                 | page content, API route, cache 래퍼     | `*.content.server.tsx` 등 SSR        |

**호출 경로 (기본)**

- `*.content.server.tsx`, `app/api/*/route.ts`(조회) → **`loader`** 또는 **`loader.cache.server`**
- `loader` 내부에서만 `service` 호출
- 클라이언트 훅은 loader **상수**만 가져오고, refetch는 `/api/*` Route Handler 경유

**의도적 예외 — auth · mutation**

- `auth.service.ts`는 조합할 조회 API가 없어 **loader를 두지 않습니다.**  
  `app/api/auth/*`, `lib/auth/session.server.ts`가 service를 직접 호출합니다.
- favorite 등 **쓰기(POST/PATCH/DELETE)** Route Handler는 mutation이 service 1건인 경우가 많아 service를 직접 호출할 수 있습니다.  
  **목록 조회**는 loader(+ cache.server)를 유지합니다.

**새 API 추가 시 판단**

1. 엔드포인트가 여러 개이고 화면이 한 번에 묶는다 → `service` + `loader` (+ 필요 시 `loader.cache.server`)
2. 엔드포인트 1개·조합 없음 → `service`만 (auth와 동일)
3. page·컴포넌트에서 service를 직접 import하려는 경우 → 조합이 필요하면 loader를 먼저 만든다

**네이밍**

- `getXxx()` — service
- `loadXxx()` — loader
- `loadXxxCached()` — loader.cache.server

---

### `*.ts` vs `*.server.ts` (`lib/{domain}/`)

| 구분      | `lib/{domain}/{name}.ts` | `lib/{domain}/{name}.server.ts` |
| --------- | ------------------------ | ------------------------------- |
| 실행 환경 | 브라우저 (Client, 훅)    | Server Component, Route Handler |
| I/O API   | `document.cookie`        | `cookies()` from `next/headers` |
| 번들      | 클라이언트 포함 가능     | **클라이언트 번들 제외**        |

공통 파싱은 접미사 없는 파일에 두고, 환경별 읽기만 나눕니다.

---

### 레이어 의존 관계 (요약)

```
*.content.server.tsx, app/api/*/route.ts(조회)
        │
        ▼
  *.loader.cache.server.ts (선택) ──► *.loader.ts ──► *.service.ts ──► 외부 API
        │
  lib/{domain}/resolve-*.ts
        │
        ▼
  lib/{domain}/*.server.ts ──► lib/{domain}/*.ts (parse/format)
        ▲
  hooks/*.ts (write/read via document.cookie)

예외: auth API · mutation route → *.service.ts 직접
```

---

### `types/` — 공유 TypeScript 타입

```
types/
├── weather-api.type.ts
├── kakao-local.type.ts
├── location.type.ts
├── favorite-press-list.type.ts
└── error.type.ts
```

---

### `mocks/` — 예시 JSON

개발·타입 참고용 API 응답 샘플입니다. 런타임 import는 하지 않습니다.

---

## 홈 페이지 데이터 흐름

```
[Server] app/(with-footer)/page.tsx
   └─ app/(with-footer)/_components/homepage-content.server.tsx
         │  resolveHomeLocation()
         │  loadWeatherSummaryCached()   ← services/weather.loader.cache.server
         ▼
[Client] homepage.client.tsx
   │  useWeather()              ← hooks/use-weather
   │  splitForecast()           ← lib/weather/split-forecast
   │  props 분배
   ▼
[UI] features/home/sections/*.section.tsx
   └─ features/weather/sections, components
```

### 역할 분담

| 데이터                           | 출처                           | 전달 방식                                |
| -------------------------------- | ------------------------------ | ---------------------------------------- |
| 실시간 날씨 (`current`)          | realtime API                   | `CurrentWeatherSection` props            |
| 예보 (`days`, `hours`, `astros`) | forecast API + `splitForecast` | 각 섹션 props                            |
| 위치·GPS·로딩·에러               | `useWeather`                   | `CurrentLocation` props (context 미사용) |

### 쿠키 정책 (메인 페이지)

- 저장 필드: `{ lat, lng, label }`
- 용도: 메인에서 **마지막으로 조회한 좌표** 복원
- 서버 content와 클라이언트 refetch 성공 시 모두 동일 쿠키 사용

---

## 새 코드 배치 체크리스트

1. **URL·라우트인가?** → `app/` (+ 필요 시 route group)
2. **그 페이지 SSR 데이터인가?** → `app/.../_components/*.content.server.tsx`
3. **그 페이지만 쓰는 client 조합인가?** → `app/.../_components/*.client.tsx`
4. **특정 기능 UI인가?** → `features/{기능}/`
5. **그 feature만 쓰는 변환·범례인가?** → `features/{기능}/lib/`
6. **여러 페이지 공통 UI인가?** → `components/` (또는 공유 feature)
7. **외부 API 호출인가?** → `services/` (`*.service` + 필요 시 `*.loader` / `*.loader.cache.server`)
8. **클라이언트 상태·훅인가?** → `hooks/` 또는 `features/{기능}/hooks/`
9. **도메인 상수·쿠키·에러·변환인가?** → `lib/{domain}/` (서버 I/O는 `*.server.ts`)
10. **순수·범용 헬퍼인가?** → `utils/`
11. **앱 전역 Context인가?** → `contexts/`
12. **타입만인가?** → `types/`

---

## 새 페이지 추가 예시 (theme-maps)

```
app/theme-maps/(with-footer)/airports/[iata]/
├── page.tsx
└── _components/
    ├── airport-detail-content.server.tsx
    └── airport-detail.client.tsx

features/theme-maps/
├── hooks/
│   └── use-place-weather.ts      # 고정 좌표 상세 공통
├── sections/
└── components/
```

- `useWeather` / GPS / 메인 쿠키와 분리합니다.
- 날씨 fetch는 `services/weather.loader.ts` / `weather.loader.cache.server.ts`를 재사용합니다.

---

## 관련 문서

- [README.md](./README.md) — 실행 방법
- [루트 AGENTS.md](../../AGENTS.md) — 에이전트 문서 인덱스
- [docs/CODING_GUIDELINES.md](../../docs/CODING_GUIDELINES.md) — 컴포넌트 네이밍·레이어·코딩 컨벤션
- [docs/README.md](../../docs/README.md) — 문서 맵
