'use client'

import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import { Spinner } from '@shared/ui/spinner'
import { ArrowBigUp, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import EmptyState from '@/components/empty-state'
import { useWeatherUnits } from '@/contexts/weather-units.context'
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
import { AppApiError } from '@/types/error.type'
import { WeatherApiRealtimeResponse } from '@/types/weather-api.type'
import { formatLocaleNumber } from '@/utils/format'

import useAirportRealtimeWeather from '../hooks/use-airport-realtime-weather'
import { Airport } from '../lib/airports'
import { THEME_MAPS_ROUTES } from '../lib/theme-maps-routes'

type AirportInfoPanelContentProps = {
	airport: Airport
	onClose: () => void
}

type AirportInfoContentProps = {
	realtimeWeather: WeatherApiRealtimeResponse
}

function AirportInfoPlaceholder() {
	return (
		<div className="bg-background/90 text-grayscale-600 border-grayscale-200 rounded-md border px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
			지도에서 공항을 선택하세요.
		</div>
	)
}

function AirportInfoLoadingContent() {
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<Spinner className="text-pastel-blue-600 size-10" />
			<p className="text-grayscale-600 animate-pulse text-sm">날씨 정보를 불러오는 중입니다.</p>
		</div>
	)
}

function AirportInfoErrorContent({ error }: { error: AppApiError | null }) {
	return (
		<EmptyState
			title="날씨 정보를 불러오지 못했습니다."
			description="공항 날씨 정보를 불러오는 데 오류가 발생했습니다."
			className="border-none p-0"
		>
			{error ? <p className="text-danger text-sm">{error?.message}</p> : null}
		</EmptyState>
	)
}

function AirportInfoContent({ realtimeWeather }: AirportInfoContentProps) {
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

function AirportInfoPanelContent({ airport, onClose }: AirportInfoPanelContentProps) {
	const { realtimeWeather, loading, error } = useAirportRealtimeWeather(airport)

	const { iata, name } = airport

	return (
		<Card className="bg-background/95 w-full max-w-sm shadow-md backdrop-blur-sm">
			<CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
				<div className="flex items-baseline gap-2">
					<CardTitle className="truncate text-lg font-semibold">{name}</CardTitle>
					<CardDescription className="text-grayscale-600 text-sm tracking-wide">{iata}</CardDescription>
				</div>
				<Button type="button" variant="ghost" size="icon-sm" aria-label="닫기" onClick={onClose} className="shrink-0">
					<X />
				</Button>
			</CardHeader>
			<CardContent className="min-h-20">
				{loading && <AirportInfoLoadingContent />}
				{!loading && (error || !realtimeWeather) && <AirportInfoErrorContent error={error} />}
				{!loading && !error && realtimeWeather && <AirportInfoContent realtimeWeather={realtimeWeather} />}
			</CardContent>
			{realtimeWeather && (
				<CardFooter>
					<Link href={THEME_MAPS_ROUTES.airportDetail(iata)} className="w-full">
						<Button type="button" className="w-full">
							자세히 보기
						</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	)
}

export { AirportInfoPanelContent, AirportInfoPlaceholder }
