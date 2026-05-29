# @shared/ui

`@shared/ui`는 Base UI 기반 shadcn/ui 컴포넌트를 모아두는 공통 React UI 패키지입니다.

## 목표

- Next.js, TanStack Start, Remix 등 React 기반 템플릿에서 공통으로 사용
- 앱에서는 그대로 import 하거나 `className`/variant로 쉽게 커스터마이징
- 프레임워크 전용 API(예: `next/*`) 의존 없이 유지

## 사용 예시

```tsx
import { Card, CardContent } from '@shared/ui/card'

export function Example() {
	return (
		<Card>
			<CardContent>공통 카드</CardContent>
		</Card>
	)
}
```

## 컴포넌트 추가 원칙

- 컴포넌트는 shadcn command로 추가하고, 생성 파일은 `src/` 아래에 유지한다.
- 개별 import는 `@shared/ui/<component>`를 기본으로 사용한다.
- `cn` 함수는 `src/lib/utils.ts`에 두고, UI 컴포넌트에서는 `@/src/lib/utils`에서 import 한다.
- 앱에서 `cn`이 필요하면 `@shared/ui/utils`를 import해서 공통 함수 하나만 사용한다.
- `components.json`의 `tailwind.css`는 `src/styles.css`를 사용해 특정 앱(`web`)과 결합하지 않는다.
