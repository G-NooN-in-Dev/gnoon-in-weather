'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Label } from '@shared/ui/label'
import { Switch } from '@shared/ui/switch'
import { useState } from 'react'

import AirportsKakaoMap from '@/features/theme-maps/components/airports-kakao-map'
import { THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'
import type { AirportPickerSectionProps } from '@/features/theme-maps/types/airport-detail-component.type'
import useAppRouter from '@/hooks/use-app-router'

const INTERNATIONAL_SWITCH_ID = 'airport-picker-international'

/**
 * 공항 상세 우측의 공항 선택 섹션
 * 한반도 전체에 마커를 두고, 마커를 선택하여 해당 공항의 상세 페이지로 이동합니다.
 * 국제선 스위치로 국제선을 운영하는 공항만 표시할 수 있습니다
 */
function AirportPickerSection({ selectedIata }: AirportPickerSectionProps) {
	const router = useAppRouter()
	const [internationalOnly, setInternationalOnly] = useState(false)

	return (
		<section>
			<Card className="gap-3 py-4">
				<CardHeader>
					<div className="flex items-center justify-between gap-3">
						<CardTitle className="text-xl font-bold">공항 선택</CardTitle>
						<div className="flex items-center gap-2">
							<Switch
								id={INTERNATIONAL_SWITCH_ID}
								checked={internationalOnly}
								onCheckedChange={(next) => {
									if (typeof next === 'boolean') {
										setInternationalOnly(next)
									}
								}}
							/>
							<Label htmlFor={INTERNATIONAL_SWITCH_ID}>국제선</Label>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<AirportsKakaoMap
						selectedIata={selectedIata}
						onSelect={(iata) => {
							if (iata === selectedIata) {
								return
							}
							router.push(THEME_MAPS_ROUTES.airportDetail(iata))
						}}
						boundsMode="korea"
						internationalOnly={internationalOnly}
						zoomable={false}
						className="h-72"
						mapClassName="size-full rounded-lg"
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default AirportPickerSection
