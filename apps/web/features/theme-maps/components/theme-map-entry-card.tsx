import { Card, CardHeader, CardTitle } from '@shared/ui/card'
import { cn } from '@shared/ui/utils'
import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

type ThemeMapIcon = ComponentType<SVGProps<SVGSVGElement>>

type ThemeMapEntryVariant = 'airport' | 'baseball'

type ThemeMapEntryCardProps = {
	href: string
	title: string
	icon: ThemeMapIcon
	iconClassName?: string
	decoIcon?: ThemeMapIcon
	decoIconClassName?: string
	variant: ThemeMapEntryVariant
}

const VARIANT_CLASS = {
	airport: {
		border: 'border-pastel-blue-400',
		icon: 'text-pastel-blue-700',
		deco: 'text-pastel-blue-300'
	},
	baseball: {
		border: 'border-pastel-green-400',
		icon: 'text-pastel-green-700',
		deco: 'text-pastel-green-300'
	}
} as const

function ThemeMapEntryCard({
	href,
	title,
	icon: Icon,
	iconClassName,
	decoIcon: DecoIcon = Icon,
	decoIconClassName,
	variant
}: ThemeMapEntryCardProps) {
	const { border, icon: iconColor, deco } = VARIANT_CLASS[variant]

	return (
		<Link
			href={href}
			className="hover:shadow-card focus-visible:ring-ring ease-standard-productive block rounded-xl transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100"
		>
			<Card className={cn('relative min-h-72 overflow-hidden border-2 lg:min-h-80', border)}>
				<CardHeader className="relative z-10 gap-3">
					<Icon aria-hidden className={cn('size-16 shrink-0', iconColor, iconClassName)} />
					<CardTitle className="text-3xl font-semibold md:text-4xl">{title}</CardTitle>
				</CardHeader>
				<DecoIcon
					aria-hidden
					className={cn('pointer-events-none absolute right-4 bottom-4 size-50', deco, decoIconClassName)}
				/>
			</Card>
		</Link>
	)
}

export default ThemeMapEntryCard
