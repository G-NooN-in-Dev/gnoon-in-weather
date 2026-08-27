// 주요 방송사
const MAIN_BROADCAST_LIST = [
	{ 'kbs.co.kr': 'KBS' },
	{ 'imbc.com': 'MBC' },
	{ 'sbs.co.kr': 'SBS' },
	{ 'jtbc.co.kr': 'JTBC' },
	{ 'ichannela.com': '채널A' },
	{ 'mbn.co.kr': 'MBN' },
	{ 'tvchosun.com': 'TV조선' },
	{ 'yonhapnewstv.co.kr': '연합뉴스TV' },
	{ 'ytn.co.kr': 'YTN' }
]

// 지역 방송사
const LOCAL_BROADCAST_LIST = [
	{ 'cjb.co.kr': 'CJB청주방송' },
	{ 'dgmbc.com': '대구MBC' },
	{ 'jmbc.co.kr': '전주MBC' },
	{ 'jibs.co.kr': 'JIBS' },
	{ 'ikbc.co.kr': 'KBC광주방송' }
]

// 종합 언론사
const COMBINED_PRESS_LIST = [
	{ 'nocutnews.co.kr': '노컷뉴스' },
	{ 'news1.kr': '뉴스1' },
	{ 'newsis.com': '뉴시스' },
	{ 'tf.co.kr': '더팩트' },
	{ 'dailian.co.kr': '데일리안' },
	{ 'inews24.com': '아이뉴스24' },
	{ 'yna.co.kr': '연합뉴스' },
	{ 'edaily.co.kr': '이데일리' },
	{ 'wowtv.co.kr': '한국경제TV' }
]

// 종합 신문사
const MAIN_PRESS_LIST = [
	{ 'khan.co.kr': '경향신문' },
	{ 'kmib.co.kr': '국민일보' },
	{ 'donga.com': '동아일보' },
	{ 'munhwa.com': '문화일보' },
	{ 'seoul.co.kr': '서울신문' },
	{ 'segye.com': '세계일보' },
	{ 'chosun.com': '조선일보' },
	{ 'joongang.co.kr': '중앙일보' },
	{ 'hani.co.kr': '한겨례' },
	{ 'hankookilbo.com': '한국일보' }
]

// 지역 언론사
const LOCAL_PRESS_LIST = [
	{ 'kado.net': '강원도민일보' },
	{ 'kwnews.co.kr': '강원일보' },
	{ 'kyeonggi.com': '경기일보' },
	{ 'kyongbuk.co.kr': '경북일보' },
	{ 'kookje.co.kr': '국제신문' },
	{ 'namdonews.com': '남도일보' },
	{ 'daejonilbo.com': '대전일보' },
	{ 'imaeil.com': '매일신문' },
	{ 'busan.com': '부산일보' }
]

const pressList = [
	...MAIN_BROADCAST_LIST,
	...LOCAL_BROADCAST_LIST,
	...COMBINED_PRESS_LIST,
	...MAIN_PRESS_LIST,
	...LOCAL_PRESS_LIST
]

type PressEntry = {
	domain: string
	name: string
}

type PressFilterGroup = {
	id: string
	label: string
	items: PressEntry[]
}

/** `{ domain: name }` 배열을 UI용 `{ domain, name }` 목록으로 변환합니다. */
function toPressEntries(list: readonly object[]): PressEntry[] {
	return list.flatMap((entry) =>
		Object.entries(entry as Record<string, string>).map(([domain, name]) => ({ domain, name }))
	)
}

/** 우측 필터 UI에 그릴 언론사 그룹 */
const PRESS_FILTER_GROUPS = [
	{ id: 'main-broadcast', label: '주요 방송사', items: toPressEntries(MAIN_BROADCAST_LIST) },
	{ id: 'local-broadcast', label: '지역 방송사', items: toPressEntries(LOCAL_BROADCAST_LIST) },
	{ id: 'main-press', label: '종합 언론사', items: toPressEntries([...COMBINED_PRESS_LIST, ...MAIN_PRESS_LIST]) },
	{ id: 'local-press', label: '지역 언론사', items: toPressEntries(LOCAL_PRESS_LIST) }
] as const satisfies readonly PressFilterGroup[]

const resolvePressName = (link: string): string => {
	for (const entry of pressList) {
		for (const [domain, name] of Object.entries(entry)) {
			if (link.includes(domain)) {
				return name
			}
		}
	}
	return ''
}

export {
	COMBINED_PRESS_LIST,
	LOCAL_BROADCAST_LIST,
	LOCAL_PRESS_LIST,
	MAIN_BROADCAST_LIST,
	MAIN_PRESS_LIST,
	PRESS_FILTER_GROUPS,
	pressList,
	resolvePressName,
	toPressEntries
}
export type { PressEntry, PressFilterGroup }
