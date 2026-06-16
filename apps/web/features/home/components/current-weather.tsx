import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import Image from 'next/image'
import Link from 'next/link'

import DataCard from '@/components/data-card'
import type { CurrentWeatherProps } from '@/features/home/types/home-component.type'
import { formatDate, formatWeatherIconUrl, formatWindKphToMps } from '@/utils/format-utils'

function CurrentWeather({ current }: CurrentWeatherProps) {
	if (!current) {
		return (
			<Card className="py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">실시간 날씨</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-grayscale-600">날씨 정보를 불러오는 중입니다.</p>
				</CardContent>
			</Card>
		)
	}

	const {
		condition,
		cloud,
		temp_c,
		feelslike_c,
		precip_mm,
		chance_of_rain,
		wind_dir,
		wind_kph,
		humidity,
		vis_km,
		uv,
		last_updated
	} = current
	const { icon: conditionIcon, text: conditionText } = condition

	return (
		<Card className="py-4">
			<CardHeader>
				<CardTitle className="text-xl font-bold">실시간 날씨</CardTitle>
			</CardHeader>
			<CardContent className="flex gap-10">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<Image src={formatWeatherIconUrl(conditionIcon)} alt={conditionText} width={64} height={64} priority />
						<div className="flex flex-col">
							<p className="text-2xl font-semibold">{conditionText}</p>
							<p className="text-grayscale-600 text-base">구름 비율 : {cloud}%</p>
						</div>
					</div>
					<div className="flex flex-col pl-4">
						<p className="text-2xl font-semibold">{temp_c}°</p>
						<p className="text-grayscale-600 text-lg">(체감 : {feelslike_c}°)</p>
					</div>
				</div>
				<div className="-mt-2 flex gap-3">
					<div className="flex flex-col gap-3">
						<DataCard title="강수량" value={precip_mm} unit="mm" />
						<DataCard title="강수 확률" value={chance_of_rain} unit="%" />
					</div>
					<div className="flex flex-col gap-3">
						<DataCard title={wind_dir} value={formatWindKphToMps(wind_kph)} unit="m/s" />
						<DataCard title="습도" value={humidity} unit="%" />
					</div>
					<div className="flex flex-col gap-3">
						<DataCard title="가시거리" value={vis_km} unit="km" />
						<DataCard title="자외선지수" value={uv} unit="" />
					</div>
				</div>
			</CardContent>
			<CardFooter className="gap-3">
				<div className="flex gap-1">
					<span>제공 : </span>
					<Link
						href="https://www.weatherapi.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-pastel-blue-700 hover:underline"
					>
						WeatherAPI
					</Link>
				</div>
				<div className="flex gap-1">
					<span>기준 : </span>
					<span className="text-grayscale-400">{formatDate(last_updated, 'YYYY.MM.DD HH:mm')}</span>
				</div>
			</CardFooter>
		</Card>
	)
}

export default CurrentWeather
