import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card'
import Image from 'next/image'
import Link from 'next/link'

import DataCard from '@/components/data-card'

function CurrentWeather() {
	return (
		<Card className="py-4">
			<CardHeader>
				<CardTitle className="text-xl font-bold">실시간 날씨</CardTitle>
			</CardHeader>
			<CardContent className="flex gap-10">
				{/* 좌측 섹션 */}
				<div className="flex flex-col gap-2">
					{/* 좌측 상단 섹션 */}
					<div className="flex items-center gap-2">
						<Image
							src="https://cdn.weatherapi.com/weather/64x64/day/113.png"
							alt="weather-icon"
							width={64}
							height={64}
						/>
						<div className="flex flex-col">
							<p className="text-2xl font-semibold">맑음</p>
							<p className="text-grayscale-600 text-base">구름 비율 : 0%</p>
						</div>
					</div>
					{/* 좌측 하단 섹션 */}
					<div className="flex flex-col pl-4">
						<p className="text-2xl font-semibold">23.6°</p>
						<p className="text-grayscale-600 text-lg">(체감 : 22.6°)</p>
					</div>
				</div>
				{/* 우측 섹션 */}
				<div className="-mt-2 flex gap-3">
					<div className="flex flex-col gap-3">
						<DataCard title="강수량" value={10} unit="mm" />
						<DataCard title="적설" value={10} unit="cm" />
					</div>
					<div className="flex flex-col gap-3">
						<DataCard title="서풍" value={4.5} unit="m/s" />
						<DataCard title="습도" value={42} unit="%" />
					</div>
					<div className="flex flex-col gap-3">
						<DataCard title="가시거리" value={16} unit="km" />
						<DataCard title="자외선지수" value={5} unit="보통" />
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
					<span className="text-grayscale-400">2026-06-03 12:00</span>
				</div>
			</CardFooter>
		</Card>
	)
}

export default CurrentWeather
