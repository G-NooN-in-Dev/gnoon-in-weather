# storybook

`@shared/ui` 컴포넌트를 문서화·미리보기하는 [Storybook 10](https://storybook.js.org/) 앱입니다.

## 개발 실행

```bash
# 루트에서
pnpm --filter storybook dev

# 또는 이 디렉터리에서
pnpm dev
```

브라우저에서 [http://localhost:6006](http://localhost:6006)으로 확인할 수 있습니다.

## 주요 파일

| 파일                         | 역할                                   |
| ---------------------------- | -------------------------------------- |
| `.storybook/main.ts`         | Storybook 10 설정 (애드온, autodocs)   |
| `.storybook/preview.tsx`     | 전역 데코레이터, 테마 툴바, a11y       |
| `.storybook/preview.css`     | Pretendard + Tailwind + 다크 모드 토큰 |
| `vite.config.ts`             | `@tailwindcss/vite` 플러그인           |
| `stories/ui/_arg-types.ts`   | Controls 패널용 argTypes 프리셋        |
| `stories/ui/_decorators.tsx` | 컴포넌트별 데코레이터 (Sonner 등)      |
| `stories/ui/`                | `@shared/ui` 컴포넌트 스토리           |

## 스토리 작성 가이드

- Storybook 10 CSF 정적 분석 요구로 `title`, `tags`는 문자열 리터럴을 사용합니다.
- Controls는 코어 기능 — **모든 UI 스토리**에 `args` + `argTypes` 패턴을 적용했습니다.
- 단순 컴포넌트는 `component` + `args`, 복합 컴포넌트는 스토리 전용 args + `render`로 연결합니다.
- `TooltipProvider`는 preview 전역 데코레이터로 제공됩니다.
- `layout: 'fullscreen'`이 필요한 스토리(예: Sidebar)만 개별 `parameters`로 지정합니다.

## 빌드

정적 Storybook 사이트를 `storybook-static`에 생성합니다.

```bash
pnpm build
```

## 참고

- [Storybook 10 문서](https://storybook.js.org/docs)
- [React + Vite 프레임워크](https://storybook.js.org/docs/get-started/frameworks/react-vite)
