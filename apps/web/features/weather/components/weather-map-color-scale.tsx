'use client'

import { useWeatherUnits } from '@/contexts/weather-units.context'
import { getWeatherMapColorScaleView } from '@/features/weather/lib/weather-map-color-scale'
import type { WeatherMapLayer, WeatherMapViewVariant } from '@/lib/weather/weather-map'

type WeatherMapColorScaleProps = {
	layer: WeatherMapLayer
	/** 미리보기는 눈금을 줄여 겹침을 피합니다. */
	viewVariant?: WeatherMapViewVariant
}

/**
 * 선택된 맵 레이어의 색상 척도.
 * 공식 범례처럼 색 바 + 눈금·수치를 그리고, 단위 설정에 맞춰 라벨을 바꿉니다.
 */
function WeatherMapColorScale({ layer, viewVariant = 'detail' }: WeatherMapColorScaleProps) {
	const { units } = useWeatherUnits()
	const { legendImageUrl, crop, unitLabel, imageAlt, ticks } = getWeatherMapColorScaleView(layer, units, viewVariant)

	// background-size로 PNG 검은 여백을 잘라 색 바만 채웁니다.
	const backgroundSize = `${100 / crop.widthRatio}% ${100 / crop.heightRatio}%`

	return (
		<div className="flex flex-col gap-1.5" aria-label={imageAlt}>
			<div className="flex items-center justify-between gap-2">
				<span className="text-grayscale-700 text-xs font-medium">척도</span>
				<span className="text-grayscale-500 text-xs tabular-nums">{unitLabel}</span>
			</div>

			{/* 양끝 눈금 라벨이 잘리지 않도록 살짝 안쪽 여백 */}
			<div className="px-2">
				<div
					role="img"
					aria-hidden
					className="h-4 w-full rounded-sm"
					style={{
						backgroundImage: `url(${legendImageUrl})`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundSize
					}}
				/>

				{/* 공식 범례와 같이 색 바 아래 눈금선 + 수치 (위치는 min~max 선형) */}
				<div className="relative mt-0.5 h-6">
					{ticks.map((tick) => {
						const { percent, label } = tick
						return (
							<div
								key={`${percent}-${label}`}
								className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
								style={{ left: `${percent}%` }}
							>
								<span className="bg-grayscale-500 h-1.5 w-px" aria-hidden />
								<span className="text-grayscale-600 mt-0.5 text-[10px] leading-none tabular-nums">{label}</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default WeatherMapColorScale
