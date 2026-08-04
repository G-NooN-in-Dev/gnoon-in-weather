/** UV 지수 WHO 등급 키 (낮음 → 위험) */
type UvIndexLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'extreme'

/**
 * 자외선 섹션·라벨 표시용 결과.
 * `tips`는 해당 등급에서 보여줄 행동 안내 문구입니다.
 */
type UvIndexGuide = {
	level: UvIndexLevel
	label: string
	rangeLabel: string
	tips: string[]
}

/**
 * UV 수치에 따라 등급·안내문을 반환합니다.
 * 구간은 WeatherAPI / WHO UV Index와 동일합니다 (낮음 0~2 … 위험 11+).
 */
function createUvIndexGuide(uv: number): UvIndexGuide {
	if (uv >= 11) {
		return {
			level: 'extreme',
			label: '위험',
			rangeLabel: '11 이상',
			tips: ['가능하면 실내에 머무르는 것이 좋습니다.', '햇볕에 노출되지 않도록 주의하세요.']
		}
	}

	if (uv >= 8) {
		return {
			level: 'very_high',
			label: '매우 높음',
			rangeLabel: '8 ~ 10',
			tips: [
				'긴 소매 옷, 모자, 선글라스를 착용하세요.',
				'자외선 차단제를 꼭 바르세요.',
				'오전 10시~오후 3시에는 외출을 자제하세요.',
				'실내나 그늘에서 활동하는 것이 좋습니다.'
			]
		}
	}

	if (uv >= 6) {
		return {
			level: 'high',
			label: '높음',
			rangeLabel: '6 ~ 7',
			tips: [
				'긴 소매 옷, 모자, 선글라스를 착용하세요.',
				'자외선 차단제를 꼭 바르세요.',
				'한낮에는 실내나 그늘에서 활동하세요.'
			]
		}
	}

	if (uv >= 3) {
		return {
			level: 'moderate',
			label: '보통',
			rangeLabel: '3 ~ 5',
			tips: ['모자·선글라스 착용을 권장합니다.', '자외선 차단제 사용을 권장합니다.']
		}
	}

	return {
		level: 'low',
		label: '낮음',
		rangeLabel: '0 ~ 2',
		tips: ['특별한 주의가 필요하지 않은 안전한 수준입니다.']
	}
}

export { createUvIndexGuide }
export type { UvIndexGuide, UvIndexLevel }
