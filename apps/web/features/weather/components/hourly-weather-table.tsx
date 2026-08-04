'use client'

import { Badge } from '@shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import dayjs from 'dayjs'
import { ArrowBigUp, SearchX } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

import EmptyState from '@/components/empty-state'
import HorizontalScrollContainer from '@/components/horizontal-scroll-container'
import { useWeatherUnits } from '@/contexts/weather-units.context'
import {
	createHourlyWeatherTimeline,
	type HourlyWeatherTimeline
} from '@/features/weather/lib/create-hourly-weather-timeline'
import {
	formatDistanceUnitLabel,
	formatHourLabelSpeedAndDistance,
	formatHourLabelTemperature,
	formatHourPrecipitationAndSnowDepth,
	formatPrecipitationUnitLabel,
	formatSnowDepthUnitLabel,
	formatSpeedUnitLabel,
	formatTemperatureLabel
} from '@/features/weather/lib/format-weather-values'
import { WeatherUnits } from '@/types/weather-units.type'
import { formatLocaleNumber } from '@/utils/format'

import { HourlyWeatherTableProps } from '../types/weather-component.type'

type TimelineRowConfig = {
	id: string
	label: (units: WeatherUnits) => ReactNode
	isVisible?: (item: HourlyWeatherTimeline) => boolean
	render: (item: HourlyWeatherTimeline, units: WeatherUnits) => ReactNode
}

const stickyTableHeadClassName = 'sticky left-0 z-1 bg-background min-w-24 w-24 '
const hourlyTablePrevButtonClassName = 'left-25'
const timelineBorderClassName = 'border-l border-border'
const tableHeadClassName = 'font-semibold'
const unitLabelClassName = 'text-muted-foreground text-sm'
const tableCellClassName = 'font-medium'

const timelineRows: TimelineRowConfig[] = [
	{
		id: 'temp',
		label: (units) => {
			const temperatureLabel = formatTemperatureLabel(units)
			return (
				<div className="flex justify-between">
					<div className="flex flex-col">
						<p className={tableHeadClassName}>온도</p>
						<p className="text-sm font-semibold">(체감온도)</p>
					</div>
					<span className={unitLabelClassName}>{temperatureLabel}</span>
				</div>
			)
		},
		render: (item, units) => {
			if (item.kind !== 'hour') return null

			const { temp, feelslike } = formatHourLabelTemperature(item, units)
			return (
				<div className="flex flex-col">
					<p className={cn(tableCellClassName, 'text-lg font-semibold')}>{temp}°</p>
					<p className={cn(tableCellClassName, 'text-sm')}>({feelslike}°)</p>
				</div>
			)
		}
	},
	{
		id: 'chance',
		label: () => <p className={tableHeadClassName}>강수확률</p>,
		render: (item) => {
			if (item.kind !== 'hour') return null

			const { chance_of_rain, chance_of_snow } = item
			const chance = Math.max(chance_of_rain, chance_of_snow)
			return (
				<span
					className={cn(
						tableCellClassName,
						'text-lg font-semibold',
						chance > 0 ? 'text-blue-600' : 'text-muted-foreground'
					)}
				>
					{chance > 0 ? `${chance}%` : '-'}
				</span>
			)
		}
	},
	{
		id: 'precip',
		label: (units) => {
			const precipitationLabel = formatPrecipitationUnitLabel(units)
			return (
				<p className="flex justify-between">
					<span className={tableHeadClassName}>강수량</span>
					<span className={unitLabelClassName}>{precipitationLabel}</span>
				</p>
			)
		},
		isVisible: (item) => {
			if (item.kind !== 'hour') return false
			return Boolean(item.chance_of_rain)
		},
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { precip } = formatHourPrecipitationAndSnowDepth(item, units)
			return (
				<span className={cn(tableCellClassName, precip > 0 ? 'text-blue-800' : 'text-muted-foreground')}>
					{formatLocaleNumber(precip)}
				</span>
			)
		}
	},
	{
		id: 'snow',
		label: (units) => {
			const snowDepthLabel = formatSnowDepthUnitLabel(units)
			return (
				<p className="flex justify-between">
					<span className={tableHeadClassName}>적설량</span>
					<span className={unitLabelClassName}>{snowDepthLabel}</span>
				</p>
			)
		},
		isVisible: (item) => {
			if (item.kind !== 'hour') return false
			return Boolean(item.chance_of_snow)
		},
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { snowDepth } = formatHourPrecipitationAndSnowDepth(item, units)
			return (
				<span className={cn(tableCellClassName, snowDepth > 0 ? 'text-blue-800' : 'text-muted-foreground')}>
					{formatLocaleNumber(snowDepth)}
				</span>
			)
		}
	},
	{
		id: 'humidity',
		label: () => <p className={tableHeadClassName}>습도</p>,
		render: (item) => {
			if (item.kind !== 'hour') return null

			const { humidity } = item
			return (
				<span
					className={cn(tableCellClassName, 'font-semibold', humidity > 0 ? 'text-blue-600' : 'text-muted-foreground')}
				>
					{humidity > 0 ? `${humidity}%` : '-'}
				</span>
			)
		}
	},
	{
		id: 'wind',
		label: (units) => {
			const windLabel = formatSpeedUnitLabel(units)
			return (
				<p className="flex justify-between">
					<span className={tableHeadClassName}>바람</span>
					<span className={unitLabelClassName}>{windLabel}</span>
				</p>
			)
		},
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { wind } = formatHourLabelSpeedAndDistance(item, units)
			const { wind_degree } = item

			const windDirection = Math.round(wind_degree / 45) % 8
			return (
				<div className="flex flex-col items-center">
					<ArrowBigUp
						className="fill-blue-500 text-blue-500"
						style={{ transform: `rotate(${windDirection * 45 + 180}deg)` }}
					/>
					<span className={tableCellClassName}>{formatLocaleNumber(wind)}</span>
				</div>
			)
		}
	},
	{
		id: 'cloud',
		label: () => <p className={tableHeadClassName}>구름비율</p>,
		render: (item) => {
			if (item.kind !== 'hour') return null

			const { cloud } = item
			return (
				<span
					className={cn(tableCellClassName, 'font-semibold', cloud > 0 ? 'text-muted-foreground' : 'text-gray-400')}
				>
					{cloud > 0 ? `${cloud}%` : '-'}
				</span>
			)
		}
	},
	{
		id: 'visibility',
		label: (units) => {
			const visibilityLabel = formatDistanceUnitLabel(units)
			return (
				<p className="flex justify-between">
					<span className={tableHeadClassName}>가시거리</span>
					<span className={unitLabelClassName}>{visibilityLabel}</span>
				</p>
			)
		},
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { visibility } = formatHourLabelSpeedAndDistance(item, units)
			return <span className={tableCellClassName}>{formatLocaleNumber(visibility)}</span>
		}
	},
	{
		id: 'uv',
		label: () => <p className={tableHeadClassName}>자외선지수</p>,
		render: (item) => {
			if (item.kind !== 'hour') return null
			return <span className={tableCellClassName}>{item.uv}</span>
		}
	}
]

function HourlyWeatherTable({ hours, astros }: HourlyWeatherTableProps) {
	const { units } = useWeatherUnits()
	const { timeline, baseDate } = createHourlyWeatherTimeline(hours, astros)

	// stale forecast처럼 전부 과거 epoch이면 hours는 있어도 표시할 열이 없습니다.
	if (timeline.length === 0) {
		return (
			<EmptyState
				className="border-none"
				icon={<SearchX className="text-grayscale-600 size-10" />}
				title="시간별 날씨 데이터 없음"
				description="표시할 시간별 날씨 데이터가 없습니다"
			/>
		)
	}

	const visibleRows = timelineRows.filter((row) => !row.isVisible || timeline.some((item) => row.isVisible?.(item)))

	return (
		<HorizontalScrollContainer prevButtonClassName={hourlyTablePrevButtonClassName}>
			<Table className="w-max">
				<TableBody className="text-center text-base [&_tr]:border-none">
					{/* 시간 헤더 */}
					<TableRow>
						<TableHead className={cn(stickyTableHeadClassName, tableHeadClassName)}>시간</TableHead>
						{timeline.map((item) => {
							const { date, epoch, kind, time, timeLabel } = item

							if (kind !== 'hour')
								return (
									<TableCell key={epoch} className={cn(timelineBorderClassName, 'font-semibold')}>
										<span className="text-destructive">{time}</span>
									</TableCell>
								)

							switch (timeLabel) {
								case '오늘':
									return (
										<TableCell
											key={epoch}
											className={cn(timelineBorderClassName, 'flex items-center justify-center font-semibold')}
										>
											<Badge className="size-fit text-base font-bold">내일</Badge>
										</TableCell>
									)
								case '내일':
									return (
										<TableCell
											key={epoch}
											className={cn(timelineBorderClassName, 'flex items-center justify-center font-semibold')}
										>
											<Badge className="bg-pastel-purple-600 size-fit text-base font-bold">내일</Badge>
										</TableCell>
									)
								case '모레':
									return (
										<TableCell
											key={epoch}
											className={cn(timelineBorderClassName, 'flex items-center justify-center font-semibold')}
										>
											<Badge className="bg-pastel-blue-600 size-fit text-base font-bold">모레</Badge>
										</TableCell>
									)
								default: {
									const dayDiff = dayjs(date).diff(dayjs(baseDate), 'day')
									return (
										<TableCell
											key={epoch}
											className={cn(
												timelineBorderClassName,
												'font-semibold',
												dayDiff === 1 && 'text-violet-700',
												dayDiff === 2 && 'text-blue-700'
											)}
										>
											{timeLabel}
										</TableCell>
									)
								}
							}
						})}
					</TableRow>
					{/* 날씨 아이콘 */}
					<TableRow>
						<TableHead className={stickyTableHeadClassName} />
						{timeline.map((item) => {
							const { epoch, kind, timeLabel } = item

							if (kind !== 'hour') {
								return (
									<TableCell key={epoch} className={cn(timelineBorderClassName, 'py-0 font-semibold')}>
										<Badge variant="destructive" className="size-fit font-bold">
											{timeLabel}
										</Badge>
									</TableCell>
								)
							}

							const { condition } = item
							const { icon, text } = condition
							return (
								<TableCell key={epoch} className={(cn(timelineBorderClassName), 'py-0')}>
									<Image src={icon} alt={text} width={32} height={32} className="mx-auto" priority />
								</TableCell>
							)
						})}
					</TableRow>
					{/* 날씨 데이터 */}
					{visibleRows.map((row) => {
						const { id, label, render } = row

						return (
							<TableRow key={id}>
								<TableHead className={stickyTableHeadClassName}>{label(units)}</TableHead>
								{timeline.map((item) => {
									const { epoch } = item
									return (
										<TableCell key={epoch} className={timelineBorderClassName}>
											{render(item, units)}
										</TableCell>
									)
								})}
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</HorizontalScrollContainer>
	)
}

export default HourlyWeatherTable
