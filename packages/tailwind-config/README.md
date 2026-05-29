# @shared/tailwind-config

레포에서 공통으로 사용하는 Tailwind 설정 패키지입니다.

자세한 설정 설명은 `CONFIG_REFERENCE.md`를 참고하세요.

## 앱 연동 템플릿

새 앱(`apps/*`) 추가 시 아래 템플릿을 그대로 사용하세요.

### 1) `postcss.config.mjs`

```js
export { default } from '@shared/tailwind-config/postcss'
```

### 2) `tailwind.config.mjs`

```js
import sharedTailwindConfig from '@shared/tailwind-config/config'

/** @type {import('tailwindcss').Config} */
const config = {
	...sharedTailwindConfig,
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}'
	]
}

export default config
```

### 3) `global.css`

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
@import 'tailwindcss';
@import '@shared/tailwind-config/base.css';
```

### 4) `app/layout.tsx`

- 전역 스타일을 한 번만 import:
  - `import '@/global.css'`
- 기본 폰트를 `global.css`에서 관리할 때는 `next/font/google`을 중복 사용하지 않습니다.

## 디자인 토큰 사용 가이드

- 기본 텍스트/보더는 `grayscale-*`를 우선 사용합니다.
- 파스텔 배경은 `100` 또는 `200` 단계 사용을 권장합니다.
- 파스텔 배경 위 텍스트는 `grayscale-700` 이상(더 진한 톤) 사용을 권장합니다.
- 상태색은 `DEFAULT` + 축약 스케일을 제공합니다.
  - `success|warning|danger|info`: `50`, `100`, `500`, `700`

## 반응형 가이드 (모바일/태블릿/데스크탑)

- 브레이크포인트:
  - 컴팩트 모바일: `xxs` (`>=320px`)
  - 모바일 기본: `<sm`
  - 태블릿: `md` (`>=768px`)
  - 데스크탑: `lg` 이상 (`>=1024px`)
- 모바일 우선으로 작성하고, `md`, `lg`에서 점진적으로 덮어씁니다.
- 매우 좁은 화면은 base/`xxs`부터 시작하고 `xs`에서 확장합니다.
- 페이지 레이아웃은 `container`와 폭 토큰을 조합합니다.
  - 페이지 셸: `container max-w-content`
  - 본문/설명: `max-w-reading` 또는 `max-w-prose`
- 모바일 브라우저 높이 변화 대응이 필요하면 `min-h-screen` 대신 `min-h-screen-safe`를 사용합니다.
- 권장 간격 패턴 예시:
  - `px-3 xxs:px-4 md:px-6 xl:px-8 py-10 md:py-16`
