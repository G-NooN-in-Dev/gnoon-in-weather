import AirportsClient from '@/app/theme-maps/(map)/airports/_components/airports.client'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'

async function ThemeMapsAirportsPage() {
	const initialUnits = await readWeatherUnitsFromCookies()

	return <AirportsClient initialUnits={initialUnits} />
}

export default ThemeMapsAirportsPage
