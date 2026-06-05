import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import Image from 'next/image'

function DailyWeatherCard() {
	return (
		<Card className="gap-2">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-xl font-bold">오늘</CardTitle>
				<CardDescription className="text-xl font-semibold">05.17 (금)</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col">
				{/* 상단 */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<Image
							src="https://cdn.weatherapi.com/weather/64x64/day/113.png"
							alt="weather-icon"
							width={100}
							height={100}
						/>
					</div>
					<div className="px-2 text-2xl font-semibold">
						<p className="text-pure-red">25°</p>
						<p className="text-pure-blue">19°</p>
					</div>
				</div>
				{/* 하단 */}
				<div className="flex flex-col gap-3 px-2 text-xl font-semibold">
					<p className="flex items-center justify-between">
						<span>강수</span>
						<div className="flex items-baseline gap-1">
							<span>60</span>
							<span className="text-muted-foreground text-base">%</span>
						</div>
					</p>
					<p className="flex items-center justify-between">
						<span>자외선</span>
						<div className="flex items-baseline gap-1">
							<span>5</span>
							<span className="text-muted-foreground text-base">보통</span>
						</div>
					</p>
				</div>
			</CardContent>
		</Card>
	)
}

export default DailyWeatherCard
