import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import Image from 'next/image'

import DataCard from '@/components/data-card'
import { useWeatherUnits } from '@/contexts/weather-units.context'
import {
	formatCurrentLabelSpeedAndDistance,
	formatCurrentLabelTemperature,
	formatCurrentPrecipitationAndSnowDepth,
	formatDistanceUnitLabel,
	formatPrecipitationUnitLabel,
	formatSnowDepthUnitLabel,
	formatSpeedUnitLabel,
	formatUvIndexLabel,
	formatWeatherIconUrl,
	formatWindDirection
} from '@/features/weather/lib/format-weather-values'
import type { CurrentWeatherProps } from '@/features/weather/types/weather-component.type'
import { formatDate } from '@/utils/format'

import WeatherApiCredit from './weather-api-credit'

function CurrentWeather({ current }: CurrentWeatherProps) {
	const { units } = useWeatherUnits()

	if (!current) {
		return (
			<Card className="py-4">
				<CardHeader>
					<CardTitle className="text-base font-bold md:text-xl">실시간 날씨</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-grayscale-600 text-sm md:text-base">날씨 정보를 불러오는 중입니다.</p>
				</CardContent>
			</Card>
		)
	}

	const { temp, feelslike } = formatCurrentLabelTemperature(current, units)
	const { wind, visibility } = formatCurrentLabelSpeedAndDistance(current, units)
	const { precip, snowDepth } = formatCurrentPrecipitationAndSnowDepth(current, units)

	const { chance_of_rain, chance_of_snow, condition, cloud, wind_degree, humidity, uv, last_updated } = current
	const { icon: conditionIcon, text: conditionText } = condition

	return (
		<Card className="gap-4 py-4">
			<CardHeader>
				<CardTitle className="text-base font-bold md:text-xl">실시간 날씨</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 md:flex-row">
				<div className="bg-grayscale-100 flex flex-row gap-4 rounded-lg p-2 pr-4 md:flex-col">
					<div className="flex items-center gap-4">
						<Image
							src={formatWeatherIconUrl(conditionIcon)}
							alt={conditionText}
							width={64}
							height={64}
							priority
							className="bg-grayscale-200 border-grayscale-500 size-fit rounded-lg border shadow-xs"
						/>
						<div className="flex flex-col md:items-center">
							<p className="text-xl font-semibold lg:text-2xl">{conditionText}</p>
							<p className="text-grayscale-600 text-sm md:text-base">구름 비율 : {cloud}%</p>
						</div>
					</div>
					<div className="flex flex-col justify-center pl-4">
						<p className="text-xl font-semibold lg:text-2xl">{temp}°</p>
						<p className="text-grayscale-600 text-base lg:text-lg">(체감 : {feelslike}°)</p>
					</div>
				</div>
				<div className="flex gap-3">
					<div className="grid w-full grid-cols-2 gap-2 md:hidden">
						{chance_of_rain > 0 ? (
							<DataCard title="강수량" value={precip} unit={formatPrecipitationUnitLabel(units)} />
						) : (
							<div />
						)}
						{chance_of_snow > 0 ? (
							<DataCard title="적설량" value={snowDepth} unit={formatSnowDepthUnitLabel(units)} />
						) : (
							<div />
						)}
						<DataCard title={formatWindDirection(wind_degree)} value={wind} unit={formatSpeedUnitLabel(units)} />
						<DataCard title="습도" value={humidity} unit="%" />
						<DataCard title="가시거리" value={visibility} unit={formatDistanceUnitLabel(units)} />
						<DataCard title="자외선지수" value={uv} unit={formatUvIndexLabel(uv)} />
					</div>

					<div className="hidden w-full md:grid md:grid-cols-3 md:gap-3">
						{chance_of_rain > 0 ? (
							<DataCard title="강수량" value={precip} unit={formatPrecipitationUnitLabel(units)} />
						) : (
							<div />
						)}
						<DataCard title={formatWindDirection(wind_degree)} value={wind} unit={formatSpeedUnitLabel(units)} />
						<DataCard title="습도" value={humidity} unit="%" />
						{chance_of_snow > 0 ? (
							<DataCard title="적설량" value={snowDepth} unit={formatSnowDepthUnitLabel(units)} />
						) : (
							<div />
						)}
						<DataCard title="가시거리" value={visibility} unit={formatDistanceUnitLabel(units)} />
						<DataCard title="자외선지수" value={uv} unit={formatUvIndexLabel(uv)} />
					</div>
				</div>
			</CardContent>
			<CardFooter className="gap-3">
				<WeatherApiCredit />
				<div className="flex gap-1">
					<span className="text-sm md:text-base">기준 : </span>
					<span className="text-grayscale-400 text-sm md:text-base">
						{formatDate(last_updated, 'YYYY.MM.DD HH:mm')}
					</span>
				</div>
			</CardFooter>
		</Card>
	)
}

export default CurrentWeather
