import BaseballClient from '@/app/theme-maps/(map)/baseball/_components/baseball.client'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'

async function ThemeMapsBaseballPage() {
	const initialUnits = await readWeatherUnitsFromCookies()

	return <BaseballClient initialUnits={initialUnits} />
}

export default ThemeMapsBaseballPage
