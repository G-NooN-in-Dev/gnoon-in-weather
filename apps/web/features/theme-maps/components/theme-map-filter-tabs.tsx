'use client'

import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'

type ThemeMapFilterOption<TValue extends string> = {
	value: TValue
	label: string
}

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type ThemeMapFilterChangeHandler<TValue extends string> = (value: TValue) => void
/* eslint-enable no-unused-vars */

type ThemeMapFilterTone = 'airport' | 'baseball' | 'default'

type ThemeMapFilterTabsProps<TValue extends string> = {
	value: TValue
	options: ReadonlyArray<ThemeMapFilterOption<TValue>>
	onValueChange: ThemeMapFilterChangeHandler<TValue>
	/** 탭 목록 접근성 이름. 예: 공항 구분 */
	ariaLabel: string
	/**
	 * TabsList 배경.
	 * airport·baseball은 지도 오버레이용 파스텔 + 그림자.
	 * default는 공통 Tabs muted 배경만 씁니다.
	 */
	tone?: ThemeMapFilterTone
	className?: string
	/** TabsList에 붙입니다. 피커처럼 전체 너비가 필요할 때 `w-full` 등. */
	listClassName?: string
}

const TABS_LIST_TONE_CLASS = {
	airport: 'bg-pastel-blue-200/95 shadow-md backdrop-blur-sm',
	baseball: 'bg-pastel-green-200/95 shadow-md backdrop-blur-sm',
	default: ''
} as const satisfies Record<ThemeMapFilterTone, string>

/**
 * 테마 지도용 단일 선택 필터 탭.
 * 옵션 개수는 호출부에서 정합니다. 공항은 2개, 야구장은 3개처럼 다르게 써도 됩니다.
 */
function ThemeMapFilterTabs<TValue extends string>({
	value,
	options,
	onValueChange,
	ariaLabel,
	tone = 'default',
	className,
	listClassName
}: ThemeMapFilterTabsProps<TValue>) {
	const isFilterValue = (next: string): next is TValue => options.some((option) => option.value === next)

	return (
		<Tabs
			value={value}
			onValueChange={(next) => {
				if (next && isFilterValue(next)) {
					onValueChange(next)
				}
			}}
			className={cn('gap-0', className)}
		>
			<TabsList aria-label={ariaLabel} className={cn(TABS_LIST_TONE_CLASS[tone], listClassName)}>
				{options.map((option) => {
					const { value: optionValue, label } = option
					return (
						<TabsTrigger key={optionValue} value={optionValue}>
							{label}
						</TabsTrigger>
					)
				})}
			</TabsList>
		</Tabs>
	)
}

export type { ThemeMapFilterOption, ThemeMapFilterTone }
export default ThemeMapFilterTabs
