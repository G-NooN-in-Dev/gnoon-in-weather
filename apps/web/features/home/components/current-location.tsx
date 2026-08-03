'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { Crosshair, Star } from 'lucide-react'

import type { LocationControlProps } from '@/features/home/types/home-component.type'
import WeatherUnitSettingsPopover from '@/features/weather/components/weather-unit-settings-popover'

function CurrentLocation({ location, loading, isLocating, error, onRequestCurrentPosition }: LocationControlProps) {
	const label = isLocating
		? '현재 위치 확인 중...'
		: loading && !location.label
			? '날씨 정보 불러오는 중...'
			: location.label || '위치 정보 없음'

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between">
				{/* 위치 정보 */}
				<div className="flex items-center gap-2 text-xl font-bold">
					<Button type="button" variant="ghost" aria-label="즐겨찾기 추가" className="p-0">
						<Star fill="var(--color-grayscale-300)" stroke="var(--color-grayscale-300)" className="size-6" />
					</Button>
					<h2>{label}</h2>
					<Button
						type="button"
						variant="ghost"
						aria-label="현재 위치로 날씨 조회"
						aria-busy={isLocating}
						disabled={isLocating || loading}
						onClick={onRequestCurrentPosition}
						className="p-0"
					>
						<Crosshair className={cn('text-pastel-blue-600 size-5', isLocating && 'animate-spin')} />
					</Button>
				</div>
				<WeatherUnitSettingsPopover />
			</div>
			{error ? <p className="text-destructive text-sm">{error.message}</p> : null}
		</div>
	)
}

export default CurrentLocation
