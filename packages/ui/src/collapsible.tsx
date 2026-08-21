'use client'

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'

import { cn } from './lib/utils'

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ className, ...props }: CollapsiblePrimitive.Trigger.Props) {
	return (
		<CollapsiblePrimitive.Trigger
			data-slot="collapsible-trigger"
			className={cn('cursor-pointer', className)}
			{...props}
		/>
	)
}

/**
 * Base UI `--collapsible-panel-height` + starting/ending style로 높이 전환합니다.
 * @see https://base-ui.com/react/components/collapsible
 */
function CollapsibleContent({ className, ...props }: CollapsiblePrimitive.Panel.Props) {
	return (
		<CollapsiblePrimitive.Panel
			data-slot="collapsible-content"
			className={cn(
				'ease-standard-productive h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 motion-reduce:transition-none',
				'data-ending-style:h-0 data-starting-style:h-0',
				"[&[hidden]:not([hidden='until-found'])]:hidden",
				className
			)}
			{...props}
		/>
	)
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
