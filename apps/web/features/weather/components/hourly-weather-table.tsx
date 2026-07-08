'use client'

import { Table, TableBody, TableCell, TableHead, TableRow } from '@shared/ui/table'
import { ArrowBigUp } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

import { useWeatherUnits } from '@/contexts/weather-units.context'
import { WeatherUnits } from '@/types/weather-units.type'
import createHourlyWeatherTimeline, { HourlyWeatherTimeline } from '@/utils/create-hourly-weather-timeline'
import {
	formatHourLabelSpeedAndDistance,
	formatHourLabelTemperature,
	formatHourPrecipitationAndSnowDepth
} from '@/utils/weather-value-format-utils'

import { HourlyWeatherTableProps } from '../types/weather-component.type'

type TimelineRowConfig = {
	id: string
	label: string | ReactNode
	isVisible?: (item: HourlyWeatherTimeline) => boolean
	render: (item: HourlyWeatherTimeline, units: WeatherUnits) => ReactNode
}

const timelineRows: TimelineRowConfig[] = [
	{
		id: 'temp',
		label: (
			<div className="flex flex-col">
				<p>온도</p>
				<p>(체감온도)</p>
			</div>
		),
		render: (item, units) => {
			if (item.kind !== 'hour') return null

			const { temp, feelslike } = formatHourLabelTemperature(item, units)

			return (
				<div className="flex flex-col">
					<p>{temp}°</p>
					<p>({feelslike}°)</p>
				</div>
			)
		}
	},
	{
		id: 'chance',
		label: '강수확률',
		render: (item) => {
			if (item.kind !== 'hour') return null

			const { chance_of_rain, chance_of_snow } = item

			return <span>{Math.max(chance_of_rain, chance_of_snow)}</span>
		}
	},
	{
		id: 'precip',
		label: '강수량',
		isVisible: (item) => {
			if (item.kind !== 'hour') return false
			return Boolean(item.chance_of_rain)
		},
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { precip } = formatHourPrecipitationAndSnowDepth(item, units)

			return <span>{precip}</span>
		}
	},
	{
		id: 'snow',
		label: '적설량',
		isVisible: (item) => {
			if (item.kind !== 'hour') return false
			return Boolean(item.chance_of_snow)
		},
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { snowDepth } = formatHourPrecipitationAndSnowDepth(item, units)

			return <span>{snowDepth}</span>
		}
	},
	{
		id: 'humidity',
		label: '습도',
		render: (item) => {
			if (item.kind !== 'hour') return null
			return <span>{item.humidity}</span>
		}
	},
	{
		id: 'wind',
		label: '바람',
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { wind } = formatHourLabelSpeedAndDistance(item, units)
			const { wind_degree } = item

			const windDirection = Math.round(wind_degree / 45) % 8

			return (
				<div className="flex flex-col">
					<ArrowBigUp
						className="fill-blue-500 text-blue-500"
						style={{ transform: `rotate(${windDirection * 45 + 180}deg)` }}
					/>
					<span>{wind}</span>
				</div>
			)
		}
	},
	{
		id: 'cloud',
		label: '구름 비율',
		render: (item) => {
			if (item.kind !== 'hour') return null
			return <span>{item.cloud}</span>
		}
	},
	{
		id: 'visibility',
		label: '가시거리',
		render: (item, units) => {
			if (item.kind !== 'hour') return null
			const { visibility } = formatHourLabelSpeedAndDistance(item, units)

			return <span>{visibility}</span>
		}
	},
	{
		id: 'uv',
		label: '자외선지수',
		render: (item) => {
			if (item.kind !== 'hour') return null
			return <span>{item.uv}</span>
		}
	}
]

function HourlyWeatherTable({ hours, astros }: HourlyWeatherTableProps) {
	const { units } = useWeatherUnits()
	// TODO - baseDate 활용하여 오늘/내일/모레 구분
	const { timeline } = createHourlyWeatherTimeline(hours, astros)

	const visibleRows = timelineRows.filter((row) => !row.isVisible || timeline.some((item) => row.isVisible?.(item)))

	return (
		<div className="overflow-x-auto">
			<Table className="w-max">
				<TableBody>
					<TableRow>
						<TableHead>시간</TableHead>
						{timeline.map((item) => {
							const { epoch, kind, timeLabel } = item
							return <TableCell key={epoch}>{kind !== 'hour' ? item.time : timeLabel}</TableCell>
						})}
					</TableRow>
					<TableRow>
						<TableHead />
						{timeline.map((item) => {
							const { epoch, kind, timeLabel } = item

							if (kind !== 'hour') return <TableCell key={epoch}>{timeLabel}</TableCell>

							const { condition } = item
							const { icon, text } = condition
							return (
								<TableCell key={epoch}>
									<Image src={icon} alt={text} width={24} height={24} />
								</TableCell>
							)
						})}
					</TableRow>
					{visibleRows.map((row) => {
						const { id, label, render } = row

						return (
							<TableRow key={id}>
								<TableHead>{label}</TableHead>
								{timeline.map((item) => {
									const { epoch } = item
									return <TableCell key={epoch}>{render(item, units)}</TableCell>
								})}
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default HourlyWeatherTable
