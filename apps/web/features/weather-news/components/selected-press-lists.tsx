import { Badge } from '@shared/ui/badge'
import { X } from 'lucide-react'

import { PressEntry } from '@/lib/naver/broadcast-press-list'

type SelectedPressListsProps = {
	selectedPresses: PressEntry[]
	selectedCount: number
	onRemove: (domain: string) => void
	isSubmitting?: boolean
}
function SelectedPressLists({ selectedPresses, selectedCount, onRemove, isSubmitting }: SelectedPressListsProps) {
	return (
		<>
			{selectedCount === 0 ? (
				<p className="text-grayscale-400 text-sm">선택된 언론사가 없습니다.</p>
			) : (
				<ul className="flex flex-wrap gap-2">
					{selectedPresses.map((press) => {
						const { domain, name } = press

						return (
							<li key={domain}>
								<Badge variant="default" className="h-7 gap-1 px-2.5 pr-1 text-sm">
									{name}
									<button
										type="button"
										aria-label={`${name} 제거`}
										className="hover:bg-primary-foreground/20 cursor-pointer rounded-full p-0.5"
										disabled={isSubmitting}
										onClick={() => onRemove(domain)}
									>
										<X className="size-3.5" data-icon="inline-end" />
									</button>
								</Badge>
							</li>
						)
					})}
				</ul>
			)}
		</>
	)
}

export default SelectedPressLists
