import BaseballInfoPanel from '@/features/theme-maps/components/baseball-info-panel'
import BaseballKakaoMap from '@/features/theme-maps/components/baseball-kakao-map'
import { getBaseballParkById } from '@/features/theme-maps/lib/baseball-parks'

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type BaseballParkSelectHandler = (id: string) => void
/* eslint-enable no-unused-vars */

type BaseballMapSectionProps = {
	selectedParkId: string | null
	onSelect: BaseballParkSelectHandler
	onClear: () => void
}

/**
 * 헤더(3.5rem) + 테마 내비(3rem) 아래 남은 뷰포트를 지도가 채웁니다.
 */
function BaseballMapSection({ selectedParkId, onSelect, onClear }: BaseballMapSectionProps) {
	const selectedPark = selectedParkId ? (getBaseballParkById(selectedParkId) ?? null) : null

	return (
		<section className="relative h-[calc(100dvh-6.5rem)] w-full">
			<BaseballKakaoMap
				selectedParkId={selectedParkId}
				onSelect={onSelect}
				onClear={onClear}
				className="size-full"
				mapClassName="size-full rounded-none"
			/>
			<div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end p-3 sm:p-4">
				<div className="pointer-events-auto w-[min(100%,20rem)]">
					<BaseballInfoPanel park={selectedPark} onClose={onClear} />
				</div>
			</div>
		</section>
	)
}

export default BaseballMapSection
