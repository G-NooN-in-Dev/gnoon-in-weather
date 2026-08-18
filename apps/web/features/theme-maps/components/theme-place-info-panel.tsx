'use client'

import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import { Spinner } from '@shared/ui/spinner'
import { ArrowBigUp, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import EmptyState from '@/components/empty-state'
import { useWeatherUnits } from '@/contexts/weather-units.context'
import usePlaceRealtimeWeather from '@/features/theme-maps/hooks/use-place-realtime-weather'
import {
	formatCurrentLabelSpeedAndDistance,
	formatCurrentLabelTemperature,
	formatCurrentPrecipitationAndSnowDepth,
	formatDistanceUnitLabel,
	formatPrecipitationUnitLabel,
	formatSnowDepthUnitLabel,
	formatSpeedUnitLabel,
	formatWeatherIconUrl
} from '@/features/weather/lib/format-weather-values'
import type { AppApiError } from '@/types/error.type'
import type { WeatherApiRealtimeResponse } from '@/types/weather-api.type'
import { formatLocaleNumber } from '@/utils/format'

type ThemePlaceInfoTarget = {
	id: string
	lat: number
	lng: number
}

type ThemePlaceInfoPanelProps = {
	title: string
	subtitle?: string
	description?: string
	place: ThemePlaceInfoTarget
	onClose: () => void
	errorDescription: string
	spinnerClassName?: string
	detailHref?: string
	detailLabel?: string
}

type ThemePlaceWeatherContentProps = {
	realtimeWeather: WeatherApiRealtimeResponse
}

function ThemePlaceInfoPlaceholder({ children }: { children: ReactNode }) {
	return (
		<div className="bg-background/90 text-grayscale-600 border-grayscale-200 rounded-md border px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
			{children}
		</div>
	)
}

function ThemePlaceInfoLoadingContent({ spinnerClassName }: { spinnerClassName: string }) {
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<Spinner className={spinnerClassName} />
			<p className="text-grayscale-600 animate-pulse text-sm">날씨 정보를 불러오는 중입니다.</p>
		</div>
	)
}

function ThemePlaceInfoErrorContent({ error, description }: { error: AppApiError | null; description: string }) {
	return (
		<EmptyState title="날씨 정보를 불러오지 못했습니다." description={description} className="border-none p-0">
			{error ? <p className="text-danger text-sm">{error.message}</p> : null}
		</EmptyState>
	)
}

function ThemePlaceWeatherContent({ realtimeWeather }: ThemePlaceWeatherContentProps) {
	const { units } = useWeatherUnits()
	const { current } = realtimeWeather
	const { wind_degree } = current
	const windDirection = Math.round(wind_degree / 45) % 8
	const { icon: conditionIcon, text: conditionText } = current.condition
	const { temp } = formatCurrentLabelTemperature(current, units)
	const { precip, snowDepth } = formatCurrentPrecipitationAndSnowDepth(current, units)
	const { visibility, wind } = formatCurrentLabelSpeedAndDistance(current, units)

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<Image src={formatWeatherIconUrl(conditionIcon)} alt={conditionText} width={64} height={64} unoptimized />
				<div className="flex min-w-0 flex-col">
					<span className="text-2xl font-semibold">{temp}°</span>
					<span className="text-grayscale-700 text-lg tracking-wide">{conditionText}</span>
				</div>
			</div>
			<div className="grid grid-cols-4 gap-3">
				<div className="flex flex-col gap-1">
					<span className="text-grayscale-700 text-sm tracking-wide">강수량</span>
					<span className="text-grayscale-700 text-sm tracking-wide">
						{formatLocaleNumber(precip)} {formatPrecipitationUnitLabel(units)}
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-grayscale-700 text-sm tracking-wide">적설량</span>
					<span className="text-grayscale-700 text-sm tracking-wide">
						{formatLocaleNumber(snowDepth)} {formatSnowDepthUnitLabel(units)}
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-grayscale-700 text-sm tracking-wide">가시거리</span>
					<span className="text-grayscale-700 text-sm tracking-wide">
						{formatLocaleNumber(visibility)} {formatDistanceUnitLabel(units)}
					</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-grayscale-700 text-sm tracking-wide">바람</span>
					<div className="-ml-0.5 flex items-center gap-1">
						<ArrowBigUp
							className="size-4 shrink-0 fill-blue-500 text-blue-500"
							style={{ transform: `rotate(${windDirection * 45 + 180}deg)` }}
						/>
						<span className="text-grayscale-700 text-sm whitespace-nowrap">
							{formatLocaleNumber(wind)} {formatSpeedUnitLabel(units)}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

function ThemePlaceInfoPanel({
	title,
	subtitle,
	description,
	place,
	onClose,
	errorDescription,
	spinnerClassName = 'text-pastel-blue-600 size-10',
	detailHref,
	detailLabel = '자세히 보기'
}: ThemePlaceInfoPanelProps) {
	const { realtimeWeather, loading, error } = usePlaceRealtimeWeather(place)

	return (
		<Card className="bg-background/95 w-full max-w-sm gap-4 shadow-md backdrop-blur-sm">
			<CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
				<div className="min-w-0">
					<div className="flex items-baseline gap-2">
						<CardTitle className="truncate text-lg font-semibold">{title}</CardTitle>
						{subtitle ? (
							<CardDescription className="text-grayscale-600 shrink-0 text-sm tracking-wide">
								{subtitle}
							</CardDescription>
						) : null}
					</div>
					{description ? <p className="text-grayscale-500 text-xs leading-5">{description}</p> : null}
				</div>
				<Button type="button" variant="ghost" size="icon-sm" aria-label="닫기" onClick={onClose} className="shrink-0">
					<X />
				</Button>
			</CardHeader>
			<CardContent className="min-h-20">
				{loading && <ThemePlaceInfoLoadingContent spinnerClassName={spinnerClassName} />}
				{!loading && (error || !realtimeWeather) && (
					<ThemePlaceInfoErrorContent error={error} description={errorDescription} />
				)}
				{!loading && !error && realtimeWeather && <ThemePlaceWeatherContent realtimeWeather={realtimeWeather} />}
			</CardContent>
			{realtimeWeather && detailHref ? (
				<CardFooter>
					<Link href={detailHref} className="w-full">
						<Button type="button" className="w-full">
							{detailLabel}
						</Button>
					</Link>
				</CardFooter>
			) : null}
		</Card>
	)
}

export { ThemePlaceInfoPlaceholder }
export default ThemePlaceInfoPanel
