import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'

import AstroScheduleTable from '../components/astro-schedule-table'

function MoonriseMoonsetSection() {
	const mockData = [
		{ date: '2026-06-15', moonrise: '17:00', moonset: '07:00' },
		{ date: '2026-06-16', moonrise: '17:00', moonset: '07:00' },
		{ date: '2026-06-17', moonrise: '17:00', moonset: '07:00' }
	]

	return (
		<section>
			<Card className="py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">월출/월몰</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<AstroScheduleTable
						data={mockData.map(({ date, moonrise, moonset }) => ({
							date,
							left: moonrise,
							right: moonset
						}))}
						leftHeader="월출"
						rightHeader="월몰"
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default MoonriseMoonsetSection
