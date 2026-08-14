import { Airport } from '../lib/airports'
import { AirportInfoPanelContent, AirportInfoPlaceholder } from './airport-info-panel-content'

type AirportInfoPanelProps = {
	airport: Airport | null
	onClose: () => void
}

function AirportInfoPanel({ airport, onClose }: AirportInfoPanelProps) {
	if (!airport) {
		return <AirportInfoPlaceholder />
	}

	return <AirportInfoPanelContent key={airport.iata} airport={airport} onClose={onClose} />
}

export default AirportInfoPanel
