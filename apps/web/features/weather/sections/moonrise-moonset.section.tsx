'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import dayjs from 'dayjs'
import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import AstroScheduleTable from '@/features/weather/components/astro-schedule-table'
import MoonriseStatus from '@/features/weather/components/moonrise-status'
import { createMoonScheduleTableRows } from '@/features/weather/lib/create-moon-schedule-table-rows'
import { createMoonriseStatus } from '@/features/weather/lib/create-moonrise-status'
import type { MoonriseMoonsetSectionProps } from '@/features/weather/types/weather-component.type'
import useIsClient from '@/hooks/use-is-client'

import WeatherApiCredit from '../components/weather-api-credit'

/**
 * 월출/월몰 섹션.
 * 어제 astro는 부모(`AstroScheduleSections`)에서 복구해 주입받습니다.
 * 어제 행 월몰이 아직 안 지났으면 표를 어제·오늘·내일로 열고, 지났으면 오늘 기준 3일입니다.
 */
function MoonriseMoonsetSection({ astros, yesterdayAstro = null }: MoonriseMoonsetSectionProps) {
	const isClient = useIsClient()
	const statusAstros = yesterdayAstro ? [yesterdayAstro, ...astros] : astros
	const forecastTodayDate = astros[0]?.date
	const moonriseStatus =
		isClient && statusAstros.length > 0 ? createMoonriseStatus(statusAstros, dayjs(), forecastTodayDate) : null

	// hydrate 전엔 오늘 기준 3일. 클라에서만 어제 월몰 경과 여부로 윈도우를 바꿉니다.
	const tableRows = isClient
		? createMoonScheduleTableRows(astros, yesterdayAstro, dayjs())
		: createMoonScheduleTableRows(astros, null)

	return (
		<section>
			<Card className="gap-0 py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">월출/월몰</CardTitle>
				</CardHeader>
				{astros.length > 0 ? (
					<CardContent className="flex flex-col gap-2">
						{moonriseStatus ? <MoonriseStatus status={moonriseStatus} /> : null}
						<AstroScheduleTable data={tableRows} leftHeader="월출" rightHeader="월몰" />
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
