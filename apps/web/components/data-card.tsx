import { Card, CardContent, CardDescription, CardTitle } from '@shared/ui/card'

type DataCardProps = {
	title: string
	value: string | number
	unit: string
}

function DataCard({ title, value, unit }: DataCardProps) {
	return (
		<Card className="py-2">
			<CardContent className="px-4">
				<CardTitle className="text-base font-semibold md:text-lg">{title}</CardTitle>
				<div className="flex items-baseline gap-1">
					<span className="text-base font-semibold md:text-lg">{value}</span>
					<CardDescription className="text-sm font-medium md:text-base">{unit}</CardDescription>
				</div>
			</CardContent>
		</Card>
	)
}

export default DataCard
