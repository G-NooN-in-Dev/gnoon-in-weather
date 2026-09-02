import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'

import { PressEntry } from '@/lib/naver/broadcast-press-list'

type PressBadgeProps = {
	press: PressEntry
	isSelected: boolean
	isDisabled: boolean
	onToggle: (press: PressEntry) => void
}

function PressBadge({ press, isSelected, isDisabled, onToggle }: PressBadgeProps) {
	return (
		<Badge
			variant={isSelected ? 'default' : 'outline'}
			className={cn(
				'h-7 px-2.5 text-sm',
				!isSelected && 'bg-grayscale-100 text-grayscale-900 hover:bg-grayscale-300 border-transparent',
				isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
			)}
			render={<button type="button" disabled={isDisabled} aria-pressed={isSelected} onClick={() => onToggle(press)} />}
		>
			{press.name}
		</Badge>
	)
}

export default PressBadge
