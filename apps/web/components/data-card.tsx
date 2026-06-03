import { Card, CardContent, CardDescription, CardTitle } from '@shared/ui/card'

interface DataCardProps {
	title: string
	value: string | number
	unit: string
}

function DataCard({ title, value, unit }: DataCardProps) {
	return (
		<Card className="py-2">
			<CardContent className="px-4">
				<CardTitle className="text-lg font-semibold">{title}</CardTitle>
				<div className="flex items-baseline gap-1">
					<span className="text-lg font-semibold">{value}</span>
					<CardDescription className="font-medium">{unit}</CardDescription>
				</div>
			</CardContent>
		</Card>
	)
}

export default DataCard
