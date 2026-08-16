'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Label } from '@shared/ui/label'
import { Switch } from '@shared/ui/switch'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import AirportsKakaoMap from '@/features/theme-maps/components/airports-kakao-map'
import { THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'

const INTERNATIONAL_SWITCH_ID = 'airport-picker-international'

/**
 * 공항 상세 우측의 공항 선택 섹션.
 * 한반도 전체에 마커를 두고, 국제공항 스위치로 마커만 걸러 해당 공항 상세로 이동합니다.
 */
function AirportPickerSection() {
	const router = useRouter()
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
							<Label htmlFor={INTERNATIONAL_SWITCH_ID}>국제선만</Label>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<AirportsKakaoMap
						selectedIata={null}
						onSelect={(iata) => {
							router.push(THEME_MAPS_ROUTES.airportDetail(iata))
						}}
						boundsMode="korea"
						internationalOnly={internationalOnly}
						className="h-72"
						mapClassName="size-full rounded-lg"
					/>
				</CardContent>
			</Card>
		</section>
	)
}

export default AirportPickerSection
