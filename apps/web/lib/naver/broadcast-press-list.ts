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
	pressList,
	resolvePressName
}
