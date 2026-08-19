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

type ThemeMapFilterTone = 'airport' | 'baseball'

type ThemeMapFilterTabsProps<TValue extends string> = {
	value: TValue
	options: ReadonlyArray<ThemeMapFilterOption<TValue>>
	onValueChange: ThemeMapFilterChangeHandler<TValue>
	/** 탭 목록 접근성 이름. 예: 공항 구분 */
	ariaLabel: string
	/** 공항은 파스텔 블루, 야구장은 파스텔 그린. TabsList 배경에만 씁니다. */
	tone: ThemeMapFilterTone
	className?: string
}

const TABS_LIST_TONE_CLASS = {
	airport: 'bg-pastel-blue-200/95',
	baseball: 'bg-pastel-green-200/95'
} as const satisfies Record<ThemeMapFilterTone, string>

/**
 * 테마 지도 위 단일 선택 필터 탭.
 * 옵션 개수는 호출부에서 정합니다. 공항은 2개, 야구장은 3개처럼 다르게 써도 됩니다.
 */
function ThemeMapFilterTabs<TValue extends string>({
	value,
	options,
	onValueChange,
	ariaLabel,
	tone,
	className
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
			<TabsList aria-label={ariaLabel} className={cn(TABS_LIST_TONE_CLASS[tone], 'shadow-md backdrop-blur-sm')}>
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
