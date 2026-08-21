import { Plane } from 'lucide-react'

import WeatherUnitSettingsPopover from '@/features/weather/components/weather-unit-settings-popover'

import type { AirportHeadingProps } from '../types/airport-detail-component.type'

function AirportHeading({ airport, error }: AirportHeadingProps) {
	const { name, iata, address } = airport

	return (
		<div className="flex items-start justify-between gap-3">
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex min-w-0 items-baseline gap-2 text-xl font-bold">
					<h2 className="truncate">{name}</h2>
					<span className="text-grayscale-600 shrink-0 text-sm font-normal tracking-wide">{iata}</span>
				</div>
				<p className="text-grayscale-500 text-sm">{address}</p>
				{error ? <p className="text-destructive text-sm">{error.message}</p> : null}
			</div>
			<div className="flex shrink-0 items-stretch gap-2 self-stretch">
				<span aria-hidden className="flex aspect-square h-full items-center justify-center">
					<Plane className="text-pastel-blue-500 size-full rotate-45" />
				</span>
				<div className="self-center">
					<WeatherUnitSettingsPopover />
				</div>
			</div>
		</div>
	)
}

export default AirportHeading
