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

## 주요 파일

- `app/page.tsx`: 메인 페이지
- `app/layout.tsx`: 루트 레이아웃
- `global.css`: 전역 스타일 (`tailwindcss` + `@shared/tailwind-config`)

## 스타일 시스템

- 공통 Tailwind v4 토큰: `@shared/tailwind-config` (`theme.css` / `base.css`)
- 폰트: Pretendard 우선 스택

## 참고

- [Next.js 문서](https://nextjs.org/docs)
