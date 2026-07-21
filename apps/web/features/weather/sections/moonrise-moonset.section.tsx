'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import dayjs from 'dayjs'
import { SearchX } from 'lucide-react'
import { useMemo } from 'react'

import EmptyState from '@/components/empty-state'
import AstroScheduleTable from '@/features/weather/components/astro-schedule-table'
import MoonriseStatus from '@/features/weather/components/moonrise-status'
import createMoonriseStatus from '@/features/weather/lib/create-moonrise-status'
import { formatLunarDateExtra } from '@/features/weather/lib/format-lunar-date'
import { formatAstroScheduleTime } from '@/features/weather/lib/format-weather-values'
import type { MoonriseMoonsetSectionProps } from '@/features/weather/types/weather-component.type'
import useIsClient from '@/hooks/use-is-client'

import WeatherApiCredit from '../components/weather-api-credit'

/**
 * 월출/월몰 섹션.
 * 어제 astro는 부모(`AstroScheduleSections`)에서 복구해 주입받습니다.
 */
function MoonriseMoonsetSection({ astros, yesterdayAstro = null }: MoonriseMoonsetSectionProps) {
	const isClient = useIsClient()
	const statusAstros = useMemo(() => (yesterdayAstro ? [yesterdayAstro, ...astros] : astros), [yesterdayAstro, astros])
	const moonriseStatus = isClient && statusAstros.length > 0 ? createMoonriseStatus(statusAstros, dayjs()) : null

	return (
		<section>
			<Card className="gap-0 py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">월출/월몰</CardTitle>
				</CardHeader>
				{astros.length > 0 ? (
					<CardContent className="flex flex-col gap-2">
						{moonriseStatus ? <MoonriseStatus status={moonriseStatus} /> : null}
						{/* dateExtra로 음력만 월출 섹션에 추가 (일출 테이블은 변경 없음) */}
						<AstroScheduleTable
							data={astros.map(({ date, moonrise, moonset }) => ({
								date,
								left: formatAstroScheduleTime(moonrise),
								right: formatAstroScheduleTime(moonset),
								dateExtra: formatLunarDateExtra(date) ?? undefined
							}))}
							leftHeader="월출"
							rightHeader="월몰"
						/>
					</CardContent>
				) : (
					<EmptyState
						icon={<SearchX className="text-grayscale-600 size-10" />}
						className="border-none"
						title="월출/월몰 데이터 없음"
						description="월출/월몰 데이터를 찾을 수 없습니다"
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

export default MoonriseMoonsetSection
