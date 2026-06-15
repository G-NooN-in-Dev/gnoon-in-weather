import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'

import AstroScheduleTable from '../components/astro-schedule-table'

function SunriseSunsetSection() {
	const mockData = [
		{ date: '2026-06-15', sunrise: '06:00', sunset: '18:00' },
		{ date: '2026-06-16', sunrise: '06:00', sunset: '18:00' },
		{ date: '2026-06-17', sunrise: '06:00', sunset: '18:00' }
	]

	return (
		<section>
			<Card className="py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">일출/일몰</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<AstroScheduleTable
						data={mockData.map(({ date, sunrise, sunset }) => ({
							date,
							left: sunrise,
							right: sunset
						}))}
						leftHeader="일출"
						rightHeader="일몰"
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default SunriseSunsetSection
