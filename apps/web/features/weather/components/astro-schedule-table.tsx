import { Card, CardContent } from '@shared/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'

import { formatDate, getDayLabel } from '@/utils/format-utils'

type AstroScheduleTableRow = {
	date: string
	left: string
	right: string
}

type AstroScheduleTableProps = {
	data: AstroScheduleTableRow[]
	leftHeader: string
	rightHeader: string
}

function AstroScheduleTable({ data, leftHeader, rightHeader }: AstroScheduleTableProps) {
	return (
		<Table className="border-separate border-spacing-x-0 border-spacing-y-2">
			<TableHeader className="text-xl [&_tr]:border-0">
				<TableRow className="hover:bg-transparent">
					<TableHead className="pl-4 text-left font-bold">{leftHeader}</TableHead>
					<TableHead />
					<TableHead className="pr-4 text-right font-bold">{rightHeader}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className="[&_tr]:border-0">
				{data.map((row, index) => {
					const { date, left, right } = row

					return (
						<TableRow key={date} className="border-0 bg-transparent hover:bg-transparent">
							<TableCell colSpan={3} className="p-0">
								<Card className="bg-grayscale-50 border-grayscale-200 py-2">
									<CardContent className="grid grid-cols-3 items-center px-4 py-0">
										<span className="text-left text-lg font-medium">{left}</span>
										<span className="text-center text-base">
											{getDayLabel(index)} ({formatDate(date, 'MM.DD')})
										</span>
										<span className="text-right text-lg font-medium">{right}</span>
									</CardContent>
								</Card>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}

export type { AstroScheduleTableRow }
export default AstroScheduleTable
