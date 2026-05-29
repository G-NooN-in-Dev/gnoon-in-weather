# storybook

`@shared/ui` 컴포넌트를 문서화·미리보기하는 [Storybook](https://storybook.js.org/) 앱입니다.

## 개발 실행

```bash
# 루트에서
pnpm --filter storybook dev

# 또는 이 디렉터리에서
pnpm dev
```

브라우저에서 [http://localhost:6006](http://localhost:6006)으로 확인할 수 있습니다.

## 주요 파일

- `.storybook/main.ts`: Storybook 설정
- `.storybook/preview.tsx`: 전역 preview 설정
- `preview.css`: Pretendard + 공통 Tailwind 스타일
- `postcss.config.mjs`: `@shared/tailwind-config` PostCSS 연동
- `stories/ui/`: `@shared/ui` 컴포넌트 스토리

## 빌드

정적 Storybook 사이트를 `storybook-static`에 생성합니다.

```bash
pnpm build
```

## 참고

- [Storybook 문서](https://storybook.js.org/docs)
