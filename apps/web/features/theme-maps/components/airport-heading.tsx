import WeatherUnitSettingsPopover from '@/features/weather/components/weather-unit-settings-popover'

import type { AirportHeadingProps } from '../types/airport-detail-component.type'

function AirportHeading({ airport, error }: AirportHeadingProps) {
	const { name, iata } = airport

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center justify-between">
				<div className="flex items-baseline gap-2 text-xl font-bold">
					<h2>{name}</h2>
					<span className="text-grayscale-600 text-sm font-normal tracking-wide">{iata}</span>
				</div>
				<WeatherUnitSettingsPopover />
			</div>
			{error ? <p className="text-destructive text-sm">{error.message}</p> : null}
		</div>
	)
}

export default AirportHeading
