'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from './lib/utils'

/** Tailwind `data-horizontal:` / `data-vertical:` 변형이 인식하는 data 속성 */
function orientationDataAttributes(orientation: 'horizontal' | 'vertical') {
	return orientation === 'horizontal' ? { 'data-horizontal': '' } : { 'data-vertical': '' }
}

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			orientation={orientation}
			data-orientation={orientation}
			{...orientationDataAttributes(orientation)}
			className={cn('group/tabs flex gap-2 data-horizontal:flex-col data-vertical:flex-row', className)}
			{...props}
		/>
	)
}

const tabsListVariants = cva(
	'group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-0.75 text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
	{
		variants: {
			variant: {
				default: 'bg-muted',
				line: 'gap-1 bg-transparent'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

/**
 * 선택 탭 위치를 따라가는 인디케이터.
 * Base UI가 `--active-tab-*` CSS 변수를 넣고, translate/width/height를 전환합니다.
 */
function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
	return (
		<TabsPrimitive.Indicator
			data-slot="tabs-indicator"
			renderBeforeHydration
			className={cn(
				'ease-standard-productive pointer-events-none absolute z-0 transition-[translate,width,height] duration-200 motion-reduce:transition-none',
				'group-data-[variant=default]/tabs-list:bg-background dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30 group-data-[variant=default]/tabs-list:top-0 group-data-[variant=default]/tabs-list:left-0 group-data-[variant=default]/tabs-list:h-(--active-tab-height) group-data-[variant=default]/tabs-list:w-(--active-tab-width) group-data-[variant=default]/tabs-list:translate-x-(--active-tab-left) group-data-[variant=default]/tabs-list:translate-y-(--active-tab-top) group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:shadow-sm dark:group-data-[variant=default]/tabs-list:border',
				'group-data-[variant=line]/tabs-list:bg-foreground group-data-[variant=line]/tabs-list:group-data-horizontal/tabs:-bottom-1.25 group-data-[variant=line]/tabs-list:group-data-horizontal/tabs:left-0 group-data-[variant=line]/tabs-list:group-data-horizontal/tabs:h-0.5 group-data-[variant=line]/tabs-list:group-data-horizontal/tabs:w-(--active-tab-width) group-data-[variant=line]/tabs-list:group-data-horizontal/tabs:translate-x-(--active-tab-left) group-data-[variant=line]/tabs-list:group-data-vertical/tabs:top-0 group-data-[variant=line]/tabs-list:group-data-vertical/tabs:-right-1 group-data-[variant=line]/tabs-list:group-data-vertical/tabs:h-(--active-tab-height) group-data-[variant=line]/tabs-list:group-data-vertical/tabs:w-0.5 group-data-[variant=line]/tabs-list:group-data-vertical/tabs:translate-y-(--active-tab-top)',
				className
			)}
			{...props}
		/>
	)
}

function TabsList({
	className,
	variant = 'default',
	children,
	...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			data-variant={variant}
			className={cn(tabsListVariants({ variant }), className)}
			{...props}
		>
			<TabsIndicator />
			{children}
		</TabsPrimitive.List>
	)
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
	return (
		<TabsPrimitive.Tab
			data-slot="tabs-trigger"
			className={cn(
				'text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:text-muted-foreground dark:hover:text-foreground ease-standard-productive relative z-10 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-3 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
				'data-active:text-foreground dark:data-active:text-foreground',
				className
			)}
			{...props}
		/>
	)
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
	return (
		<TabsPrimitive.Panel data-slot="tabs-content" className={cn('flex-1 text-sm outline-none', className)} {...props} />
	)
}

type TabsListVariant = NonNullable<VariantProps<typeof tabsListVariants>['variant']>

export const tabsListVariantOptions = ['default', 'line'] as const satisfies readonly TabsListVariant[]

export { Tabs, TabsContent, TabsIndicator, TabsList, tabsListVariants, TabsTrigger }
