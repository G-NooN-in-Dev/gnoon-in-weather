# apps/web 아키텍처 가이드

`apps/web`의 폴더 역할과 코드 배치 기준을 정리한 문서입니다.  
Next.js App Router 위에 **기능 단위 UI(`features/`)** 와 **공통 인프라(`services/`, `utils/` 등)** 를 나눈 구조입니다.

---

## 아키텍처 개요

페이지는 보통 아래 3단으로 구성합니다.

```
app/page.tsx (Server)           ← 쿠키·fetch·초기 데이터
  └─ app/_components/*.client.tsx (Client)  ← GPS·refetch·섹션 조합
       └─ features/*/sections, components  ← UI 조각 (props)
```

공통 코드는 기능(`features/`) 밖의 루트 폴더에 둡니다.

```
app/  features/  components/  services/  hooks/  lib/  utils/  types/
```

| 폴더               | 한 줄 역할                                         |
| ------------------ | -------------------------------------------------- |
| `app/`             | 라우트, SSR, API Route                             |
| `app/_components/` | 페이지 전용 client 조합기                          |
| `features/`        | 도메인(홈, 날씨 등) UI · feature 전용 `lib/`       |
| `components/`      | 앱 전역 공통 UI                                    |
| `services/`        | 외부 API 호출                                      |
| `hooks/`           | 클라이언트 훅                                      |
| `lib/`             | 도메인 모듈(상수·규칙·쿠키·정규화) `lib/{domain}/` |
| `utils/`           | 순수·범용 헬퍼만 (`format`, `cookie` 등)           |
| `types/`           | 공유 타입                                          |

---

## `app/_components`는 왜 쓰나?

### 1. Next.js 규칙

`_`로 시작하는 폴더는 **URL 라우트가 되지 않습니다.**  
`app/_components/homepage.client.tsx`는 경로가 아니라, 해당 라우트 옆에 붙인 코드입니다.

### 2. 역할 분리 (colocation)

한 페이지를 두 파일로 나눕니다.

| 파일                       | 실행 환경 | 담당                                   |
| -------------------------- | --------- | -------------------------------------- |
| `page.tsx`                 | Server    | 쿠키 읽기, API fetch, 초기 데이터 준비 |
| `_components/*.client.tsx` | Client    | `useState`, GPS, refetch, 섹션 조합    |

**feature UI**(`current-weather.tsx` 등)와 **페이지 조합기**(`homepage.client.tsx`)를 분리하는 이유:

- feature 컴포넌트 → 재사용·테스트 가능한 UI 조각
- `*.client.tsx` → 그 페이지에서만 필요한 client 경계

### 네이밍

- `{페이지명}.client.tsx` (예: `homepage.client.tsx`)
- 라우트가 깊어지면 해당 경로 아래 `_components/`에 둡니다.

```
app/theme-maps/
├── page.tsx
└── _components/
    └── theme-maps.client.tsx
```

---

## 디렉터리별 역할

### `app/` — 라우트·서버 진입점

```
app/
├── page.tsx                    # 홈 SSR
├── layout.tsx                  # 전역 레이아웃
├── _components/
│   └── homepage.client.tsx     # 홈 client 조합기
└── api/
    └── weather/route.ts        # 클라이언트 refetch용
```

**넣을 것**

- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- API Route (`route.ts`)
- **그 페이지에서만** 쓰는 `*.client.tsx`

**넣지 말 것**

- 여러 페이지에서 쓰는 UI
- 비즈니스 로직이 담긴 presentational 컴포넌트

---

### `features/` — 기능(도메인) 단위 UI

```
features/weather/                  # 여러 페이지에서 재사용하는 날씨 표시 UI
├── types/
│   └── weather-component.type.ts  # 날씨 섹션 공통 props
├── sections/
│   ├── daily-weather.section.tsx
│   └── index.ts
└── components/
    ├── current-weather.tsx
    └── daily-weather-card.tsx

features/home/                     # 홈 전용 (GPS 위치, 페이지 조합)
├── types/
│   └── home-component.type.ts     # 홈 전용 props (LocationControl 등)
├── sections/
│   ├── current-weather.section.tsx
│   └── index.ts
└── components/
    └── current-location.tsx
```

**넣을 것**

- 특정 기능(홈, 테마지도 등)에만 쓰는 섹션·카드·테이블
- **2개 이상 feature에서 쓰는 날씨 UI** → `features/weather/`
- 섹션 파일: `*.section.tsx` (프로젝트 컨벤션)

**규칙**

- 표시 데이터는 **props로** 받습니다.
- 섹션이 context를 직접 읽지 않도록 유지합니다. (테스트·재사용 용이)
- 날씨 섹션 props는 `features/weather/types/weather-component.type.ts`에 정의합니다.
- 기능 전용 props(GPS 위치 등)는 `features/{기능}/types/`에 정의하고 `&`로 조합합니다.

**공통 props 예시**

| 타입                         | 위치      | 사용처                                           |
| ---------------------------- | --------- | ------------------------------------------------ |
| `CurrentWeatherProps`        | `weather` | `CurrentWeather`, `UvIndexSection`               |
| `ForecastDaysSectionProps`   | `weather` | `DailyWeatherSection`                            |
| `ForecastAstroSectionProps`  | `weather` | `SunriseSunsetSection`, `MoonriseMoonsetSection` |
| `LocationControlProps`       | `home`    | `CurrentLocation`                                |
| `CurrentWeatherSectionProps` | `home`    | `LocationControlProps` + `CurrentWeatherProps`   |

**새 기능 추가 예시**

```
features/theme-maps/
├── sections/
└── components/
```

---

### `components/` — 앱 전역 공통 UI

```
components/
├── header.tsx
├── footer.tsx
├── nav.tsx
└── data-card.tsx
```

**넣을 것**

- 2개 이상 feature/페이지에서 쓰는 UI (헤더, 푸터, 공통 카드 등)

---

### `services/` — 외부 API 호출

```
services/
├── weather.service.ts    # WeatherAPI 직접 호출 (current, forecast)
└── weather.loader.ts     # page + API route 공통 파사드
```

**넣을 것**

- HTTP/API 호출, 외부 서비스 연동
- 서버·클라이언트 양쪽에서 쓰는 로더/파사드

**구분** — 상세는 [레이어 구분 패턴](#레이어-구분-패턴-serviceloaderservert) 참고

- `*.service.ts` — 저수준 API 클라이언트 (엔드포인트 1건)
- `*.loader.ts` — 여러 service를 묶은 앱용 파사드

---

### `hooks/` — React 훅 (클라이언트)

```
hooks/
└── use-weather.ts    # GPS, 좌표 변경 시 refetch, 쿠키 저장
```

**넣을 것**

- `'use client'` 환경에서 쓰는 상태·행동 훅
- 여러 client 컴포넌트에서 공유하는 로직

**참고**

- 특정 feature에만 쓰는 훅은 `features/{name}/hooks/`로 옮겨도 됩니다.
- 현재 `use-weather`는 홈 client에서 쓰이지만 루트 `hooks/`에 있습니다.

---

### `lib/` — 도메인 모듈 (`lib/{domain}/`)

앱 인프라·도메인 로직을 **도메인 폴더**로 묶습니다. Next 생태계에서 흔한 `lib/` 단수명을 사용합니다.

```
lib/
├── api-error.ts                 # AppApiError 타입 가드 (횡단)
├── weather/
│   ├── constants.ts             # revalidate, 풍향
│   ├── units.ts                 # 단위 옵션·쿠키 상수
│   ├── units-cookie.ts          # 단위 쿠키 parse/read/write
│   ├── units-cookie.server.ts
│   ├── error-rules.ts           # WeatherAPI 에러 코드 매핑
│   ├── normalize-error.ts
│   ├── api-route-errors.ts
│   ├── format-location.ts
│   ├── parse-api-query.ts
│   ├── split-forecast.ts
│   └── is-realtime-stale.ts
├── location/
│   ├── constants.ts             # 기본 좌표, 쿠키 이름/만료
│   ├── cookie.ts
│   ├── cookie.server.ts
│   └── resolve-home.ts          # 쿠키 → 기본 좌표
└── kakao/
    ├── error-rules.ts
    └── normalize-error.ts
```

**넣을 것**

- 도메인 상수·규칙 테이블
- 쿠키 I/O, 에러 정규화, 짧은 오케스트레이션
- 여러 feature/서비스에서 공유하는 도메인 변환

**`utils/`와 구분**

| `lib/{domain}/`                     | `utils/`          |
| ----------------------------------- | ----------------- |
| 도메인에 묶인 모듈(상수+I/O+정규화) | 순수·범용 헬퍼만  |
| `lib/weather/normalize-error.ts`    | `utils/format.ts` |
| `lib/location/resolve-home.ts`      | `utils/cookie.ts` |

**feature 전용 로직** — 한 feature UI에서만 쓰면 `features/{name}/lib/`에 둡니다.  
예: `features/weather/lib/format-weather-values.ts`, `create-hourly-weather-timeline.ts`, `condition-legend.ts`

---

### `utils/` — 순수·범용 헬퍼

```
utils/
├── format.ts    # formatLocaleNumber, formatDate, formatTime12To24
└── cookie.ts    # readBrowserCookie (document.cookie 한 줄)
```

**넣을 것**

- 도메인에 종속되지 않는 짧은 순수 함수
- 브라우저 쿠키용 아주 작은 공통 헬퍼

도메인 변환·쿠키 정책·에러 매핑은 `lib/` 또는 `features/*/lib/`로 올립니다.

**서버 전용 파일** — 상세는 [레이어 구분 패턴](#레이어-구분-패턴-serviceloaderservert) 참고.  
`*.server.ts`는 보통 `lib/{domain}/` 안에 둡니다.

---

## 레이어 구분 패턴 (service · loader · server)

`services/`와 `lib/`에서 파일을 나눌 때 따르는 공통 규칙입니다.  
새 외부 API·쿠키·스토리지 연동을 추가할 때 이 패턴을 우선 적용합니다.

### `*.service.ts` vs `*.loader.ts`

| 구분      | `*.service.ts`                                         | `*.loader.ts`                                         |
| --------- | ------------------------------------------------------ | ----------------------------------------------------- |
| 역할      | 외부 API **엔드포인트 1건** 호출                       | 여러 service를 **조합**해 화면/API가 쓰는 형태로 반환 |
| 반환      | API 응답 타입 그대로 (`WeatherApiRealtimeResponse` 등) | 앱 도메인 타입 (`WeatherSummary` 등)                  |
| 기본값    | `lang`, `days` 등 호출 파라미터 수준                   | 화면/API 공통 기본값 상수 (`HOME_FORECAST_DAYS` 등)   |
| 의존 방향 | loader → service (역방향 금지)                         | page, `route.ts`에서 직접 import                      |

**현재 예시**

```
weather.service.ts          weather.loader.ts
├── buildWeatherApiUrl      ├── loadWeatherSummary()
├── getRealtimeWeather() ───┤     Promise.all([
├── getForecastWeather()  ──┘       getRealtimeWeather(),
└── fetch + cache + 에러 변환         getForecastWeather()
                                    ])
                                    → { realtime, forecast }
```

**호출 경로**

- `app/page.tsx` (SSR), `app/api/*/route.ts` → **`loader`만** import
- `loader` 내부에서만 `service` 호출
- 클라이언트 훅은 보통 `loader`의 **상수**만 가져오고, refetch는 `/api/*` Route Handler 경유

**새 API 추가 시 판단**

1. WeatherAPI처럼 **엔드포인트가 여러 개**이고 화면이 **한 번에 묶어서** 쓴다  
   → `{domain}.service.ts` (건당 함수) + `{domain}.loader.ts` (조합 함수)
2. **엔드포인트 1개**만 쓰고 조합이 없다  
   → `service`만 두거나, 이름을 `service`로 유지한 단일 파일
3. `service`를 page·컴포넌트에서 **직접** import하려는 경우  
   → 조합이 필요하면 `loader`를 먼저 만든다

**네이밍**

- `getXxx()` — service (저수준)
- `loadXxx()` — loader (앱 진입점)

---

### `*.ts` vs `*.server.ts` (`lib/{domain}/`)

Next.js에서 `cookies()`, `headers()` 등은 **서버 전용**입니다.  
같은 쿠키/값을 읽더라도 **실행 환경별 API가 다르므로** 파일을 나눕니다.

| 구분      | `lib/{domain}/{name}.ts`        | `lib/{domain}/{name}.server.ts`            |
| --------- | ------------------------------- | ------------------------------------------ |
| 실행 환경 | 브라우저 (Client Component, 훅) | Server Component, Route Handler            |
| I/O API   | `document.cookie`               | `cookies()` from `next/headers`            |
| 쓰기      | 클라이언트에서 가능 (`write*`)  | 보통 읽기만 (쓰기는 Route Handler 등 별도) |
| 번들      | 클라이언트에 포함 가능          | **클라이언트 번들 제외** (`.server` 관례)  |

**공통 파싱은 한 곳에**

환경마다 **raw 값을 가져오는 방법**만 다르고, JSON 파싱·검증은 동일해야 합니다.

```
lib/location/cookie.ts                    lib/location/cookie.server.ts
├── parseLatestSearchedLocationCookie() ◄──┤ readLatestSearchedLocationFromCookies()
├── readLatestSearchedLocationCookie()     │   cookies().get() → parse 재사용
└── writeLatestSearchedLocationCookie()    └── (쓰기 없음)
```

- `parse*`, `format*`, `normalize*` → 접미사 없는 파일 (서버·클라이언트 공용)
- `read*FromCookies()` (서버), `read*Cookie()` / `write*Cookie()` (클라이언트) → 환경별 파일

**새 스토리지/쿠키 추가 시 판단**

1. 파싱·검증 로직 작성 → `lib/{domain}/{name}.ts`
2. 서버에서 읽기 필요 → `lib/{domain}/{name}.server.ts`에서 `cookies()` 사용 후 `parse*` 호출
3. 클라이언트에서 읽기/쓰기 필요 → 동일 도메인 `{name}.ts`에 `document.cookie` 처리
4. `.server.ts`에서 `document` 사용 금지, `.ts`에서 `cookies()` import 금지

**오케스트레이션 위치**

- 쿠키 **읽기 한 줄** → `lib/{domain}/*.server.ts`
- 쿠키 → 기본값 등 **도메인 정책** → `lib/{domain}/resolve-*.ts`
  - 예: `lib/location/resolve-home.ts` — `readLatestSearchedLocationFromCookies()` + `DEFAULT_COORDINATES`

---

### 레이어 의존 관계 (요약)

```
app/page.tsx, app/api/*/route.ts
        │
        ▼
  *.loader.ts ──► *.service.ts ──► 외부 API
        │
  lib/{domain}/resolve-*.ts
        │
        ▼
  lib/{domain}/*.server.ts ──► lib/{domain}/*.ts (parse/format)
        ▲
  hooks/*.ts (write/read via document.cookie)
```

---

### `types/` — 공유 TypeScript 타입

```
types/
├── weather-api.type.ts       # WeatherAPI 타입, WeatherSummary, WeatherFetchParams
├── location.type.ts
└── error.type.ts
```

**날씨 타입 구분**

| 타입                                       | 용도                                     |
| ------------------------------------------ | ---------------------------------------- |
| `WeatherApiCurrent`, `ForecastDayEntry` 등 | API 필드·섹션 props                      |
| `WeatherSummary`                           | `{ realtime, forecast }` 통합 응답       |
| `WeatherFetchParams`                       | 좌표 + `lang` / `days` API 호출 파라미터 |

---

### `mocks/` — 예시 JSON

개발·타입 참고용 API 응답 샘플입니다.

---

## 홈 페이지 데이터 흐름

```
[Server] app/page.tsx
   │  resolveHomeLocation()     ← lib/location/resolve-home + lib/location/cookie.server
   │  loadWeatherSummary()      ← services/weather.loader
   ▼
[Client] app/_components/homepage.client.tsx
   │  useWeather()              ← hooks/use-weather (GPS·refetch, 첫 fetch skip)
   │  splitForecast()           ← lib/weather/split-forecast
   │  props 분배
   ▼
[UI] features/home/sections/*.section.tsx  (홈 전용)
   └─ features/weather/sections, components  (공통 날씨 UI)
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
- 서버 `page.tsx`와 클라이언트 refetch 성공 시 모두 동일 쿠키 사용

---

## 새 코드 배치 체크리스트

코드를 추가할 때 아래 순서로 판단합니다.

1. **URL·라우트인가?** → `app/`
2. **그 페이지만 쓰는 client 조합인가?** → `app/.../_components/*.client.tsx`
3. **특정 기능 UI인가?** → `features/{기능}/`
4. **그 feature만 쓰는 변환·범례인가?** → `features/{기능}/lib/`
5. **여러 페이지 공통 UI인가?** → `components/`
6. **외부 API 호출인가?** → `services/` (`*.service.ts` + 필요 시 `*.loader.ts`)
7. **클라이언트 상태·훅인가?** → `hooks/` (또는 `features/{기능}/hooks/`)
8. **도메인 상수·쿠키·에러·변환인가?** → `lib/{domain}/` (서버 I/O는 `*.server.ts`)
9. **순수·범용 헬퍼인가?** → `utils/`
10. **타입만인가?** → `types/`

---

## 새 페이지 추가 예시 (theme-maps)

GPS 없이 사전 정의 좌표만 쓰는 페이지는 client 조합기 없이 서버만으로도 가능합니다.

```
app/theme-maps/
├── page.tsx                          # 서버: 좌표 리스트 lookup + fetch
└── _components/
    └── theme-maps.client.tsx         # (선택) 지도 상호작용이 필요할 때만

features/theme-maps/
├── sections/
└── components/
```

- `useWeather` / GPS / 메인 쿠키와 분리하는 것을 권장합니다.
- 날씨 fetch는 `services/weather.loader.ts`를 재사용합니다.

---

## 관련 문서

- [README.md](./README.md) — 실행 방법
- [루트 AGENTS.md](../../AGENTS.md) — 모노레포·스타일 공통 규칙
- `.cursor/rules/react-component-template.mdc` — 섹션 컴포넌트 네이밍
- `.cursor/rules/web-services-utils-layers.mdc` — service/loader, `.server.ts` 레이어 규칙
