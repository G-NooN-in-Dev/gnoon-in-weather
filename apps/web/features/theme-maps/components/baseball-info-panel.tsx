import Image from 'next/image'

import { type BaseballPark, getBaseballParkHomeTeamIds } from '@/features/theme-maps/lib/baseball-parks'
import { type BaseballTeam, getBaseballTeamsByIds } from '@/features/theme-maps/lib/baseball-teams'

import ThemePlaceInfoPanel, { ThemePlaceInfoPlaceholder } from './theme-place-info-panel'

type BaseballInfoPanelProps = {
	park: BaseballPark | null
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

function BaseballInfoPanel({ park, onClose }: BaseballInfoPanelProps) {
	if (!park) {
		return <ThemePlaceInfoPlaceholder>지도에서 야구장을 선택하세요.</ThemePlaceInfoPlaceholder>
	}

	const { id, name, address, lat, lng } = park
	const homeTeams = getBaseballTeamsByIds(getBaseballParkHomeTeamIds(park))

	return (
		<ThemePlaceInfoPanel
			key={id}
			title={name}
			subtitle={homeTeams.length > 0 ? <BaseballHomeTeamLogos teams={homeTeams} /> : undefined}
			description={address}
			place={{ id, lat, lng }}
			onClose={onClose}
			errorDescription="야구장 날씨 정보를 불러오는 데 오류가 발생했습니다."
			spinnerClassName="text-pastel-green-600 size-10"
		/>
	)
}

export default BaseballInfoPanel
