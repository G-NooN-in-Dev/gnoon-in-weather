import { Card, CardContent } from '@shared/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
// import type { ReactNode } from 'react'

export type AstroScheduleTableRow = {
	date: string
	left: string
	right: string
}

type AstroScheduleTableProps = {
	data: AstroScheduleTableRow[]
	leftHeader: string
	rightHeader: string
	/** 가운데 열 커스텀 렌더 (음력 날짜 등). 미지정 시 양력 오늘/내일/모레 표시 */
	// renderCenter?: (row: AstroScheduleTableRow, index: number) => ReactNode
}

function getDefaultCenterLabel(row: AstroScheduleTableRow, index: number) {
	const dateLabel = index === 0 ? '오늘' : index === 1 ? '내일' : '모레'
	const shortDate = row.date.slice(5).replace('-', '.')
	return (
		<span className="text-center text-base">
			{dateLabel} ({shortDate})
		</span>
	)
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
				{data.map((row, index) => (
					<TableRow key={row.date} className="border-0 bg-transparent hover:bg-transparent">
						<TableCell colSpan={3} className="p-0">
							<Card className="bg-grayscale-50 border-grayscale-200 py-2">
								<CardContent className="grid grid-cols-3 items-center px-4 py-0">
									<span className="text-left text-lg font-medium">{row.left}</span>
									{/* {renderCenter ? renderCenter(row, index) : getDefaultCenterLabel(row, index)} */}
									{getDefaultCenterLabel(row, index)}
									<span className="text-right text-lg font-medium">{row.right}</span>
								</CardContent>
							</Card>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default AstroScheduleTable
