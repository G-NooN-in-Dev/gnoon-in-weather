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
		<div className="flex items-start justify-between gap-3">
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex min-w-0 items-baseline gap-2 text-xl font-bold">
					<h2 className="truncate">{name}</h2>
					<span className="text-grayscale-600 shrink-0 text-sm font-normal tracking-wide">{homeTeamLabel}</span>
				</div>
				<p className="text-grayscale-500 text-sm">{address}</p>
				{error ? <p className="text-destructive text-sm">{error.message}</p> : null}
			</div>
			<div className="flex shrink-0 items-stretch gap-2 self-stretch">
				<div aria-hidden className="flex h-full items-stretch gap-1.5">
					{homeTeams.map(({ id, logoSrc }) => (
						<span key={id} className="relative aspect-square h-full">
							<Image src={logoSrc} alt="" fill className="object-contain" sizes="80px" />
						</span>
					))}
				</div>
				<div className="self-center">
					<WeatherUnitSettingsPopover />
				</div>
			</div>
		</div>
	)
}

export default BaseballHeading
