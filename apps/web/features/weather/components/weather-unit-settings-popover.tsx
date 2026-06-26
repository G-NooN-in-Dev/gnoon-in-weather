'use client'

import { Button } from '@shared/ui/button'
import { Label } from '@shared/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger
} from '@shared/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { RotateCcwIcon } from 'lucide-react'
import { useCallback, useState } from 'react'

import { useWeatherUnits } from '@/contexts/weather-units.context'
import type { WeatherUnitOption } from '@/libs/weather-units'
import { DISTANCE_UNITS, PRECIPITATION_UNITS, SNOW_DEPTH_UNITS, TEMPERATURE_UNITS } from '@/libs/weather-units'
import { WeatherUnits } from '@/types/weather-units.type'

type WeatherUnitOptionTabsProps<T extends string> = {
	title: string
	value: T
	options: ReadonlyArray<WeatherUnitOption<T>>
	onValueChange: (value: T) => void
}

function WeatherUnitOptionTabs<T extends string>({
	title,
	value,
	options,
	onValueChange
}: WeatherUnitOptionTabsProps<T>) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="text-sm font-medium">{title}</Label>
			<Tabs
				value={value}
				onValueChange={(next) => {
					if (next) {
						onValueChange(next as T)
					}
				}}
			>
				<TabsList className="w-full">
					{options.map((option) => {
						const { label, value } = option
						return (
							<TabsTrigger key={value} value={value} className="flex-1">
								{label}
							</TabsTrigger>
						)
					})}
				</TabsList>
			</Tabs>
		</div>
	)
}

function WeatherUnitSettingsPopover() {
	const { units, applyUnits } = useWeatherUnits()
	const [draftUnits, setDraftUnits] = useState<WeatherUnits>(units)
	const [open, setOpen] = useState(false)

	const { temperature, distance, precipitation, snowDepth } = draftUnits

	const updateDraft = <K extends keyof WeatherUnits>(key: K, value: WeatherUnits[K]) => {
		setDraftUnits((prev) => ({ ...prev, [key]: value }))
	}

	const resetUnits = useCallback(() => {
		setDraftUnits(units)
	}, [units])

	const handleClose = () => {
		setOpen(false)
	}

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			resetUnits()
		}

		setOpen(nextOpen)
	}

	const handleCancel = () => {
		resetUnits()
		handleClose()
	}

	const handleComplete = () => {
		applyUnits(draftUnits)
		handleClose()
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger render={<Button type="button" aria-label="단위 설정" className="" />}>
				<span>단위 설정</span>
			</PopoverTrigger>
			<PopoverContent>
				<PopoverHeader className="flex-row items-center justify-between">
					<PopoverTitle>
						<span className="text-lg font-extrabold">단위 설정</span>
					</PopoverTitle>
					<PopoverDescription className="flex items-center" aria-label="초기화">
						<Button type="button" variant="link" onClick={resetUnits}>
							<RotateCcwIcon className="size-4" />
							<span>초기화</span>
						</Button>
					</PopoverDescription>
				</PopoverHeader>

				<div className="flex flex-col gap-4">
					<WeatherUnitOptionTabs
						title="온도"
						value={temperature}
						options={TEMPERATURE_UNITS}
						onValueChange={(value) => updateDraft('temperature', value)}
					/>
					<WeatherUnitOptionTabs
						title="거리"
						value={distance}
						options={DISTANCE_UNITS}
						onValueChange={(value) => updateDraft('distance', value)}
					/>
					<WeatherUnitOptionTabs
						title="강수량"
						value={precipitation}
						options={PRECIPITATION_UNITS}
						onValueChange={(value) => updateDraft('precipitation', value)}
					/>
					<WeatherUnitOptionTabs
						title="적설량"
						value={snowDepth}
						options={SNOW_DEPTH_UNITS}
						onValueChange={(value) => updateDraft('snowDepth', value)}
					/>
				</div>

				<div className="flex justify-end gap-2">
					<Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
						취소
					</Button>
					<Button type="button" variant="default" className="flex-1" onClick={handleComplete}>
						완료
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default WeatherUnitSettingsPopover
