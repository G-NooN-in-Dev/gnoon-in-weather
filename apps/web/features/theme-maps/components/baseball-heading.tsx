import WeatherUnitSettingsPopover from '@/features/weather/components/weather-unit-settings-popover'

import { getBaseballParkHomeTeamLabel } from '../lib/baseball-parks'
import type { BaseballHeadingProps } from '../types/baseball-detail-component.type'

function BaseballHeading({ park, error }: BaseballHeadingProps) {
	const { name, address } = park
	const homeTeamLabel = getBaseballParkHomeTeamLabel(park)

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between">
				<div className="flex items-baseline gap-2 text-xl font-bold">
					<h2>{name}</h2>
					{homeTeamLabel ? (
						<span className="text-grayscale-600 text-sm font-normal tracking-wide">{homeTeamLabel}</span>
					) : null}
				</div>
				<WeatherUnitSettingsPopover />
			</div>
			<p className="text-grayscale-500 text-sm">{address}</p>
			{error ? <p className="text-destructive text-sm">{error.message}</p> : null}
		</div>
	)
}

export default BaseballHeading
