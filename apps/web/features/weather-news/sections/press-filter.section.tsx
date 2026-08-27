'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { X } from 'lucide-react'

import type { PressFilterSectionProps } from '@/features/weather-news/types/weather-news-component.type'
import { PRESS_FILTER_GROUPS, type PressEntry } from '@/lib/naver/broadcast-press-list'

/**
 * 우측 언론사 필터 패널.
 * 선택 즉시 피드에 반영되며, 선호목록·저장은 DB 연결 시 확장합니다.
 */
function PressFilterSection({ selectedPresses, maxSelection, onToggle, onRemove, onReset }: PressFilterSectionProps) {
	const selectedCount = selectedPresses.length
	const isAtLimit = selectedCount >= maxSelection
	const selectedDomainSet = new Set(selectedPresses.map((press) => press.domain))

	return (
		<section className="flex w-full flex-col gap-6" aria-label="언론사 필터">
			<div className="border-grayscale-200 flex flex-col gap-3 border-b pb-6">
				<h2 className="text-grayscale-900 text-base font-semibold">내 선호목록</h2>
				<p className="text-grayscale-400 text-sm">저장된 목록이 없습니다.</p>
			</div>

			<div className="flex flex-col gap-5">
				<h2 className="text-grayscale-900 text-base font-semibold">언론사 목록</h2>

				{PRESS_FILTER_GROUPS.map((group) => {
					const { id, label, items } = group

					return (
						<div key={id} className="flex flex-col gap-2">
							<h3 className="text-grayscale-600 text-sm font-medium">{label}</h3>
							<ul className="flex flex-wrap gap-2">
								{items.map((press) => {
									const { domain } = press
									const isSelected = selectedDomainSet.has(domain)
									const isDisabled = isAtLimit && !isSelected

									return (
										<li key={domain}>
											<PressBadge press={press} isSelected={isSelected} isDisabled={isDisabled} onToggle={onToggle} />
										</li>
									)
								})}
							</ul>
						</div>
					)
				})}
			</div>

			<div className="border-grayscale-200 flex flex-col gap-3 border-y py-6">
				<h2 className="text-grayscale-900 text-base font-semibold">
					현재 적용 ({selectedCount}/{maxSelection})
				</h2>

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
			</div>

			<div className="flex gap-3">
				<Button type="button" variant="outline" className="flex-1" onClick={onReset} disabled={selectedCount === 0}>
					초기화
				</Button>
				<Button type="button" className="flex-1" disabled>
					목록 저장
				</Button>
			</div>
		</section>
	)
}

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
				!isSelected && 'bg-grayscale-200 text-grayscale-900 hover:bg-grayscale-300 border-transparent',
				isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
			)}
			render={<button type="button" disabled={isDisabled} aria-pressed={isSelected} onClick={() => onToggle(press)} />}
		>
			{press.name}
		</Badge>
	)
}

export default PressFilterSection
