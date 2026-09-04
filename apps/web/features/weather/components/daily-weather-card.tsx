import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { Separator } from '@shared/ui/separator'
import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import { formatDayLabel, formatWeatherIconUrl } from '@/features/weather/lib/format-weather-values'
import type { ForecastDayEntry } from '@/types/weather-api.type'
import { formatDate } from '@/utils/format'

type DailyWeatherCardProps = {
	day: ForecastDayEntry
	dayIndex: number
}

const dataLabelClassName = 'text-base md:text-xl'
const dataValueClassName = 'text-xl tracking-wide md:text-2xl'

function DailyWeatherCard({ day, dayIndex }: DailyWeatherCardProps) {
	const { date, condition, maxtemp_c, mintemp_c, daily_chance_of_rain, uv } = day
	const { icon: conditionIcon, text: conditionText } = condition

	return (
		<Card className="gap-2">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-base font-bold md:text-xl">{formatDayLabel(dayIndex)}</CardTitle>
				<CardDescription className="text-base font-semibold md:text-xl">{formatDate(date, 'MM.DD')}</CardDescription>
			</CardHeader>
			<CardContent className={cn('flex gap-3 md:gap-4', dayIndex === 0 ? 'flex-row md:flex-col' : 'flex-col')}>
				<div className="flex w-full items-center justify-between gap-4">
					<Image
						src={formatWeatherIconUrl(conditionIcon)}
						alt={conditionText}
						width={64}
						height={64}
						priority
						className="border-border size-fit rounded-lg border shadow-xs"
					/>
					<div className={cn('text-right font-semibold', dataValueClassName)}>
						<p className="text-pure-red">{maxtemp_c}°</p>
						<p className="text-pure-blue">{mintemp_c}°</p>
					</div>
				</div>
				{dayIndex === 0 && (
					<Separator orientation="vertical" className="bg-border data-[orientation=vertical]:h-auto md:hidden" />
				)}
				<Separator orientation="horizontal" className={cn('bg-border w-full', dayIndex === 0 && 'hidden md:block')} />
				<div className="flex w-full flex-col justify-center gap-3 font-semibold">
					<div className="flex items-center justify-between">
						<span className={dataLabelClassName}>강수</span>
						<div className="flex items-baseline gap-1">
							<span className={dataValueClassName}>{daily_chance_of_rain}</span>
							<span className="text-muted-foreground text-sm md:text-base">%</span>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<span className={dataLabelClassName}>자외선</span>
						<div className="flex items-baseline gap-1">
							<span className={dataValueClassName}>{uv}</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default DailyWeatherCard
