# web

`apps/web`은 Next.js(App Router) 기반 앱입니다.

## 개발 실행

```bash
# 루트에서
pnpm --filter web dev

# 또는 이 디렉터리에서
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 확인할 수 있습니다.

## 아키텍처

폴더 역할·데이터 흐름·`_components` 사용 이유, **service/loader·`.server.ts` 레이어 규칙**은 **[ARCHITECTURE.md](./ARCHITECTURE.md)** 를 참고하세요.

## 주요 파일

- `app/page.tsx`: 메인 페이지 (서버 — 쿠키·날씨 fetch)
- `app/_components/homepage.client.tsx`: 메인 client 조합기
- `app/layout.tsx`: 루트 레이아웃
- `features/home/`: 홈 UI (sections, components)
- `services/weather.loader.ts`: 서버·API 공통 날씨 로더
- `global.css`: 전역 스타일 (`tailwindcss` + `@shared/tailwind-config`)

## 스타일 시스템

- 공통 Tailwind v4 토큰: `@shared/tailwind-config` (`theme.css` / `base.css`)
- 폰트: Pretendard 우선 스택

## 참고

- [ARCHITECTURE.md](./ARCHITECTURE.md) — 디렉터리 구조 가이드
- [Next.js 문서](https://nextjs.org/docs)
