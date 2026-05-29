# Tailwind Config 레퍼런스

이 문서는 `tailwind.config.mjs`의 공통 설정과 토큰 사용법을 설명합니다.

## 루트 옵션

- `darkMode: ['class']`
  - 루트에 `dark` 클래스를 붙여 다크 모드를 제어합니다.
  - 예시: `dark:bg-grayscale-900 dark:text-grayscale-100`

## theme.container

- `center: true`
  - 페이지 콘텐츠를 중앙 정렬합니다.
- `padding`
  - 컴팩트 모바일부터 데스크탑까지 반응형 좌우 여백을 제공합니다.
  - 예시: `container max-w-content`

## theme.screens

- `xxs: 320px`, `xs: 480px`, `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`
- 모바일 우선 설계:
  - base 스타일을 먼저 작성
  - 이후 `xxs:`, `xs:`, `md:`, `lg:` 순서로 확장

## theme.extend.fontFamily

- `font-sans`: Pretendard 우선 UI 폰트 스택
- `font-mono`: 코드/수치 표현에 유리한 모노 스택

## theme.extend.colors

- 파스텔 팔레트: `red`, `orange`, `yellow`, `green`, `blue`, `purple`
  - 각 팔레트는 `DEFAULT`와 `50..950` 스케일 제공
- 기본 텍스트/보더 팔레트: `grayscale`
- 상태색: `success`, `warning`, `danger`, `info`
  - 각 상태색은 `DEFAULT`, `50`, `100`, `500`, `700` 제공

## theme.extend.fontSize

- `xs`부터 `3xl`까지, 각 단계의 line-height를 함께 정의했습니다.
- 화면/컴포넌트별 타이포 리듬을 일관되게 유지할 수 있습니다.

## theme.extend.borderRadius

- 토큰: `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl`, `rounded-pill`
- 권장 용도:
  - 컨트롤/칩: `rounded-pill`
  - 카드: `rounded-2xl`
  - 다이얼로그/강조 섹션: `rounded-3xl` 또는 `rounded-4xl`

## theme.extend.spacing

- 추가 토큰: `18`, `22`, `26`, `30`, `34`
- 큰 섹션 간격, 레이아웃 리듬 통일에 유용합니다.

## theme.extend.boxShadow

- `shadow-soft`: 약한 높이감
- `shadow-card`: 카드형 UI 강조

## theme.extend.maxWidth

- `max-w-prose`: 긴 본문 텍스트
- `max-w-reading`: 설명/문단 블록
- `max-w-content`: 페이지 메인 셸

## theme.extend.minHeight

- `min-h-screen-safe`는 `100dvh`를 사용합니다.
- 모바일 브라우저의 동적 툴바 환경에서 안정적인 전체 높이를 제공합니다.

## theme.extend.zIndex

- `z-dropdown`, `z-sticky`, `z-modal`, `z-toast`
- 오버레이 레이어 우선순위를 일관되게 맞출 수 있습니다.

## theme.extend.transitionTimingFunction

- `ease-emphasized-in`
- `ease-emphasized-out`
- `ease-standard-productive`

임의의 `cubic-bezier`를 남발하지 않고 공통 모션 톤을 유지할 때 사용합니다.

## theme.extend.transitionDuration

- `duration-0`, `duration-400`
- 즉시 전환/강조 전환에 대한 공통 시간 토큰입니다.

## theme.extend.backgroundImage

- Radial 계열:
  - `bg-radial-blue`
  - `bg-radial-pink`
  - `bg-radial-purple`
- Linear 계열:
  - `bg-linear-sky`
  - `bg-linear-sunrise`
  - `bg-linear-mint`
- Multi-layer 계열:
  - `bg-mesh-soft`

히어로/카드/마케팅 섹션의 장식성 배경에 활용할 수 있습니다.

## theme.extend.keyframes / animation

- 키프레임: `accordion-down`, `accordion-up`
- 유틸리티 클래스:
  - `animate-accordion-down`
  - `animate-accordion-up`

아코디언/접힘 패널 UI 애니메이션에 사용합니다.
