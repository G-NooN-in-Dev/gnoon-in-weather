import type { Airport } from '@/features/theme-maps/lib/airports'
import { THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'

import ThemePlaceInfoPanel, { ThemePlaceInfoPlaceholder } from './theme-place-info-panel'

type AirportInfoPanelProps = {
	airport: Airport | null
	onClose: () => void
}

function AirportInfoPanel({ airport, onClose }: AirportInfoPanelProps) {
	if (!airport) {
		return <ThemePlaceInfoPlaceholder>지도에서 공항을 선택하세요.</ThemePlaceInfoPlaceholder>
	}

	const { iata, name, address, lat, lng } = airport

	return (
		<ThemePlaceInfoPanel
			key={iata}
			title={name}
			subtitle={iata}
			description={address}
			place={{ id: iata, lat, lng }}
			onClose={onClose}
			errorDescription="공항 날씨 정보를 불러오는 데 오류가 발생했습니다."
			spinnerClassName="text-pastel-blue-600 size-10"
			detailHref={THEME_MAPS_ROUTES.airportDetail(iata)}
			detailLabel="자세히 보기"
		/>
	)
}

export default AirportInfoPanel
