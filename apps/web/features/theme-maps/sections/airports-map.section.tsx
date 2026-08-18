import AirportInfoPanel from '@/features/theme-maps/components/airport-info-panel'
import AirportsKakaoMap from '@/features/theme-maps/components/airports-kakao-map'
import { getAirportByIata } from '@/features/theme-maps/lib/airports'

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type AirportSelectHandler = (iata: string) => void
/* eslint-enable no-unused-vars */

type AirportsMapSectionProps = {
	selectedIata: string | null
	onSelect: AirportSelectHandler
	onClear: () => void
}

/**
 * 헤더(3.5rem) + 테마 내비(3rem) 아래 남은 뷰포트를 지도가 채웁니다.
 */
function AirportsMapSection({ selectedIata, onSelect, onClear }: AirportsMapSectionProps) {
	const selectedAirport = selectedIata ? (getAirportByIata(selectedIata) ?? null) : null

	return (
		<section className="relative h-[calc(100dvh-6.5rem)] w-full overflow-hidden">
			<div className="pointer-events-none absolute top-3 right-3 z-20 w-[min(100%-1.5rem,20rem)] sm:top-4 sm:right-4">
				<div className="pointer-events-auto">
					<AirportInfoPanel airport={selectedAirport} onClose={onClear} />
				</div>
			</div>
			<AirportsKakaoMap
				selectedIata={selectedIata}
				onSelect={onSelect}
				onClear={onClear}
				className="size-full"
				mapClassName="size-full rounded-none"
			/>
		</section>
	)
}

export default AirportsMapSection
