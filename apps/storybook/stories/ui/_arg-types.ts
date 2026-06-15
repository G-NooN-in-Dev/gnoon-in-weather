/** Storybook Controls 패널용 공통 argTypes 프리셋 */

import { positionerAlignOptions, positionerSideOptions } from '@shared/ui/lib/layout-options'

export const textArgType = (description: string) => ({
	control: 'text' as const,
	description
})

export const booleanArgType = (description: string) => ({
	control: 'boolean' as const,
	description
})

export const selectArgType = (options: readonly string[], description: string) => ({
	control: 'select' as const,
	options: [...options],
	description
})

export const radioArgType = (options: readonly string[], description: string) => ({
	control: 'radio' as const,
	options: [...options],
	description
})

export const rangeArgType = (min: number, max: number, step: number, description: string) => ({
	control: { type: 'range' as const, min, max, step },
	description
})

/** Popover·Tooltip·HoverCard 등 오버레이 위치 */
export const sideArgType = (description: string) => selectArgType(positionerSideOptions, description)

/** Popover·Tooltip·HoverCard 등 오버레이 정렬 */
export const alignArgType = (description: string) => selectArgType(positionerAlignOptions, description)
