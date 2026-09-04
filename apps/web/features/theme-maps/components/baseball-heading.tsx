import Image from 'next/image'

import WeatherUnitSettingsPopover from '@/features/weather/components/weather-unit-settings-popover'

import { getBaseballParkHomeTeamIds, getBaseballParkHomeTeamLabel } from '../lib/baseball-parks'
import { getBaseballTeamsByIds } from '../lib/baseball-teams'
import type { BaseballHeadingProps } from '../types/baseball-detail-component.type'

function BaseballHeading({ park, error }: BaseballHeadingProps) {
	const { name, address } = park
	const homeTeamLabel = getBaseballParkHomeTeamLabel(park)
	const homeTeams = getBaseballTeamsByIds(getBaseballParkHomeTeamIds(park))

	return (
		<div className="flex min-w-0 items-start justify-between gap-3 px-2">
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex min-w-0 items-baseline gap-2 text-xl font-bold">
					<h2 className="truncate">{name}</h2>
					<span className="text-grayscale-600 shrink-0 text-sm font-normal tracking-wide">{homeTeamLabel}</span>
				</div>
				<p className="text-grayscale-500 text-sm wrap-break-word">{address}</p>
				{error ? <p className="text-destructive text-sm wrap-break-word">{error.message}</p> : null}
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<div aria-hidden className="flex items-center gap-1.5">
					{homeTeams.map(({ id, logoSrc }) => (
						<span key={id} className="relative size-10 sm:size-12">
							<Image src={logoSrc} alt="" fill className="object-contain" sizes="48px" />
						</span>
					))}
				</div>
				<WeatherUnitSettingsPopover />
			</div>
		</div>
	)
}

export default BaseballHeading
