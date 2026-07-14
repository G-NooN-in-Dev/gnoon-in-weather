import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import Image from 'next/image'

import { formatDayLabel, formatWeatherIconUrl } from '@/features/weather/lib/format-weather-values'
import type { ForecastDayEntry } from '@/types/weather-api.type'
import { formatDate } from '@/utils/format'

type DailyWeatherCardProps = {
	day: ForecastDayEntry
	dayIndex: number
}

function DailyWeatherCard({ day, dayIndex }: DailyWeatherCardProps) {
	const { date, condition, maxtemp_c, mintemp_c, daily_chance_of_rain, uv } = day
	const { icon: conditionIcon, text: conditionText } = condition

	return (
		<Card className="gap-2">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-xl font-bold">{formatDayLabel(dayIndex)}</CardTitle>
				<CardDescription className="text-xl font-semibold">{formatDate(date, 'MM.DD')}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col">
				<div className="flex items-center justify-between gap-4">
					<div>
						<Image src={formatWeatherIconUrl(conditionIcon)} alt={conditionText} width={100} height={100} priority />
					</div>
					<div className="px-2 text-right text-2xl font-semibold">
						<p className="text-pure-red">{maxtemp_c}°</p>
						<p className="text-pure-blue">{mintemp_c}°</p>
					</div>
				</div>
				<div className="flex flex-col gap-3 px-2 text-xl font-semibold">
					<div className="flex items-center justify-between">
						<span>강수</span>
						<div className="flex items-baseline gap-1">
							<span>{daily_chance_of_rain}</span>
							<span className="text-muted-foreground text-base">%</span>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<span>자외선</span>
						<div className="flex items-baseline gap-1">
							<span>{uv}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default DailyWeatherCard
