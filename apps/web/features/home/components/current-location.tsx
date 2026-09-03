'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { Crosshair, Star } from 'lucide-react'

import type { LocationControlProps } from '@/features/home/types/home-component.type'
import WeatherUnitSettingsPopover from '@/features/weather/components/weather-unit-settings-popover'

function CurrentLocation({
	location,
	loading,
	isLocating,
	error,
	onRequestCurrentPosition,
	isFavorite,
	isFavoritePending,
	onToggleFavorite
}: LocationControlProps) {
	const label = isLocating
		? '현재 위치 확인 중...'
		: loading && !location.label
			? '날씨 정보 불러오는 중...'
			: location.label || '위치 정보 없음'

	const canToggleFavorite = Boolean(location.label.trim()) && !loading && !isLocating

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between">
				{/* 위치 정보 */}
				<div className="flex items-center gap-1 md:gap-2">
					<Button
						type="button"
						variant="ghost"
						aria-label={isFavorite ? '관심지역 해제' : '관심지역 추가'}
						aria-pressed={isFavorite}
						aria-busy={isFavoritePending}
						disabled={!canToggleFavorite || isFavoritePending}
						onClick={onToggleFavorite}
						className="p-0"
					>
						<Star
							className={cn('size-6', isFavorite ? 'text-pastel-yellow-500' : 'text-grayscale-300')}
							fill={isFavorite ? 'currentColor' : 'transparent'}
							stroke="currentColor"
						/>
					</Button>
					<h2 className="font-bold md:text-xl">{label}</h2>
					<Button
						type="button"
						variant="ghost"
						aria-label="현재 위치로 날씨 조회"
						aria-busy={isLocating}
						disabled={isLocating || loading}
						onClick={onRequestCurrentPosition}
						className="p-0"
					>
						<Crosshair className={cn('text-pastel-blue-600 size-5 font-bold', isLocating && 'animate-spin')} />
					</Button>
				</div>
				<WeatherUnitSettingsPopover />
			</div>
			{error ? <p className="text-destructive text-sm">{error.message}</p> : null}
		</div>
	)
}

export default CurrentLocation
