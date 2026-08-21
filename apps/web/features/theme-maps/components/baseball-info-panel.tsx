import Image from 'next/image'

import {
	type BaseballPark,
	type BaseballParkMapFilter,
	getBaseballParkHomeTeamIds
} from '@/features/theme-maps/lib/baseball-parks'
import { type BaseballTeam, getBaseballTeamsByIds } from '@/features/theme-maps/lib/baseball-teams'
import { THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'

import ThemePlaceInfoPanel, { ThemePlaceInfoPlaceholder } from './theme-place-info-panel'

type BaseballInfoPanelProps = {
	park: BaseballPark | null
	/** 자세히 보기 시 1군·2군 모두인 구장의 탭을 유지하기 위해 넘깁니다. */
	mapFilter: BaseballParkMapFilter
	onClose: () => void
}

type BaseballHomeTeamLogosProps = {
	teams: BaseballTeam[]
}

function BaseballHomeTeamLogos({ teams }: BaseballHomeTeamLogosProps) {
	return (
		<span className="flex items-center gap-1">
			{teams.map(({ id, name, logoSrc }) => (
				<Image
					key={id}
					src={logoSrc}
					alt={name}
					title={name}
					width={28}
					height={28}
					className="h-7 w-auto object-contain"
				/>
			))}
		</span>
	)
}

function BaseballInfoPanel({ park, mapFilter, onClose }: BaseballInfoPanelProps) {
	if (!park) {
		return <ThemePlaceInfoPlaceholder>지도에서 야구장을 선택하세요.</ThemePlaceInfoPlaceholder>
	}

	const { id, name, address, lat, lng } = park
	const homeTeams = getBaseballTeamsByIds(getBaseballParkHomeTeamIds(park))

	return (
		<ThemePlaceInfoPanel
			key={id}
			title={name}
			subtitle={<BaseballHomeTeamLogos teams={homeTeams} />}
			description={address}
			place={{ id, lat, lng }}
			onClose={onClose}
			errorDescription="야구장 날씨 정보를 불러오는 데 오류가 발생했습니다."
			spinnerClassName="text-pastel-green-600 size-10"
			detailHref={THEME_MAPS_ROUTES.baseballDetail(id, mapFilter)}
			detailLabel="자세히 보기"
		/>
	)
}

export default BaseballInfoPanel
