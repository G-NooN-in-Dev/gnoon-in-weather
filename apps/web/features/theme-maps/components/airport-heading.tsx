import { Plane } from 'lucide-react'

import WeatherUnitSettingsPopover from '@/features/weather/components/weather-unit-settings-popover'

import type { AirportHeadingProps } from '../types/airport-detail-component.type'

function AirportHeading({ airport, error }: AirportHeadingProps) {
	const { name, iata, address } = airport

	return (
		<div className="flex min-w-0 items-start justify-between gap-3 px-2">
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex min-w-0 items-baseline gap-2 text-xl font-bold">
					<h2 className="truncate">{name}</h2>
					<span className="text-grayscale-600 shrink-0 text-sm font-normal tracking-wide">{iata}</span>
				</div>
				<p className="text-grayscale-500 text-sm wrap-break-word">{address}</p>
				{error ? <p className="text-destructive text-sm wrap-break-word">{error.message}</p> : null}
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<span aria-hidden className="flex size-10 items-center justify-center p-0.5 sm:size-12 sm:p-1">
					<Plane className="text-pastel-blue-500 size-full rotate-45" />
				</span>
				<WeatherUnitSettingsPopover />
			</div>
		</div>
	)
}

export default AirportHeading
