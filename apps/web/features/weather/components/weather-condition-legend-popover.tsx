'use client'

import { Button } from '@shared/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger
} from '@shared/ui/popover'
import { ScrollArea } from '@shared/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { Info } from 'lucide-react'
import Image from 'next/image'

import { getWeatherConditionLegendItems } from '@/features/weather/lib/condition-legend'

const LEGEND_ITEMS = getWeatherConditionLegendItems()

function WeatherConditionLegendPopover() {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label="날씨 아이콘 설명"
						className="text-grayscale-600"
					/>
				}
			>
				<Info />
			</PopoverTrigger>
			<PopoverContent align="start" className="w-80 gap-3 p-3">
				<PopoverHeader>
					<PopoverTitle className="text-base font-bold">날씨 아이콘 설명</PopoverTitle>
					<PopoverDescription hidden />
				</PopoverHeader>

				{/* 주간 | 야간 | 내용 표 — 항목이 많아 세로 스크롤 */}
				<ScrollArea className="h-72">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-12 px-1 text-center">주간</TableHead>
								<TableHead className="w-12 px-1 text-center">야간</TableHead>
								<TableHead className="px-2">내용</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{LEGEND_ITEMS.map((item) => {
								const { id, dayIconUrl, nightIconUrl, label } = item

								return (
									<TableRow key={id}>
										<TableCell className="px-1 py-1.5 text-center">
											<Image
												src={dayIconUrl}
												alt={`${label} (주간)`}
												width={32}
												height={32}
												className="mx-auto size-8"
											/>
										</TableCell>
										<TableCell className="px-1 py-1.5 text-center">
											<Image
												src={nightIconUrl}
												alt={`${label} (야간)`}
												width={32}
												height={32}
												className="mx-auto size-8"
											/>
										</TableCell>
										<TableCell className="px-2 py-1.5 text-sm">{label}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	)
}

export default WeatherConditionLegendPopover
