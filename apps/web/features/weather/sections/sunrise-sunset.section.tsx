'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import dayjs from 'dayjs'
import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import AstroScheduleTable from '@/features/weather/components/astro-schedule-table'
import SunriseStatus from '@/features/weather/components/sunrise-status'
import { createSunriseStatus } from '@/features/weather/lib/create-sunrise-status'
import { formatAstroScheduleTime } from '@/features/weather/lib/format-weather-values'
import type { ForecastAstroSectionProps } from '@/features/weather/types/weather-component.type'
import useIsClient from '@/hooks/use-is-client'

import WeatherApiCredit from '../components/weather-api-credit'

/**
 * 일출/일몰 섹션.
 */
function SunriseSunsetSection({ astros }: ForecastAstroSectionProps) {
	const isClient = useIsClient()
	const [today, tomorrow] = astros
	const sunriseStatus = isClient && today ? createSunriseStatus(today, tomorrow, dayjs()) : null

	return (
		<section>
			<Card className="gap-0 py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">일출/일몰</CardTitle>
				</CardHeader>
				{astros.length > 0 ? (
					<CardContent className="flex flex-col">
						{sunriseStatus ? <SunriseStatus status={sunriseStatus} /> : null}
						<AstroScheduleTable
							data={astros.map(({ date, sunrise, sunset }) => ({
								date,
								left: formatAstroScheduleTime(sunrise),
								right: formatAstroScheduleTime(sunset)
							}))}
							leftHeader="일출"
							rightHeader="일몰"
						/>
					</CardContent>
				) : (
					<EmptyState
						icon={<SearchX className="text-grayscale-600 size-10" />}
						className="border-none"
						title="일출/일몰 데이터 없음"
						description="일출/일몰 데이터를 찾을 수 없습니다"
					>
						<p className="text-muted-foreground text-sm">위치를 확인한 뒤 다시 조회해 주세요.</p>
					</EmptyState>
				)}
				<CardFooter className="mt-2">
					<WeatherApiCredit />
				</CardFooter>
			</Card>
		</section>
	)
}

export default SunriseSunsetSection
