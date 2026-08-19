/** KBO 퓨처스(2군) 북부·남부 리그. 야구장 상세에서 씁니다. */
type BaseballFuturesLeague = 'north' | 'south'

type BaseballTeamLevel = 'first' | 'second'

const BASEBALL_FUTURES_LEAGUE_LABEL = {
	north: '북부리그',
	south: '남부리그'
} as const satisfies Record<BaseballFuturesLeague, string>

type BaseballTeam = {
	id: string
	name: string
	color: string
	logoSrc: string
	/** 1군 구단의 2군 표기. 상무·울산처럼 2군만 있는 팀은 두지 않습니다. */
	futuresTeamName?: string
	/** 2군이 속한 퓨처스 리그. 1군만 쓰는 값은 없습니다. */
	futuresLeague?: BaseballFuturesLeague
}

const BASEBALL_TEAMS = [
	{
		id: 'lg',
		name: 'LG 트윈스',
		futuresTeamName: 'LG 트윈스 2군',
		futuresLeague: 'north',
		color: '#C30452',
		logoSrc: '/images/baseball/logos/lg-twins.svg'
	},
	{
		id: 'hanwha',
		name: '한화 이글스',
		futuresTeamName: '한화 이글스 2군',
		futuresLeague: 'north',
		color: '#FC4E00',
		logoSrc: '/images/baseball/logos/hanwha-eagles.svg'
	},
	{
		id: 'ssg',
		name: 'SSG 랜더스',
		futuresTeamName: 'SSG 랜더스 2군',
		futuresLeague: 'north',
		color: '#CE0E2D',
		logoSrc: '/images/baseball/logos/ssg-landers.svg'
	},
	{
		id: 'samsung',
		name: '삼성 라이온즈',
		futuresTeamName: '삼성 라이온즈 2군',
		futuresLeague: 'south',
		color: '#074CA1',
		logoSrc: '/images/baseball/logos/samsung-lions.svg'
	},
	{
		id: 'nc',
		name: 'NC 다이노스',
		futuresTeamName: 'NC 다이노스 C팀',
		futuresLeague: 'south',
		color: '#315288',
		logoSrc: '/images/baseball/logos/nc-dinos.svg'
	},
	{
		id: 'kt',
		name: 'KT 위즈',
		futuresTeamName: 'KT 위즈 2군',
		futuresLeague: 'south',
		color: '#000000',
		logoSrc: '/images/baseball/logos/kt-wiz.svg'
	},
	{
		id: 'lotte',
		name: '롯데 자이언츠',
		futuresTeamName: '롯데 자이언츠 2군',
		futuresLeague: 'south',
		color: '#041E42',
		logoSrc: '/images/baseball/logos/lotte-giants.svg'
	},
	{
		id: 'kia',
		name: 'KIA 타이거즈',
		futuresTeamName: 'KIA 타이거즈 2군',
		futuresLeague: 'south',
		color: '#EA0029',
		logoSrc: '/images/baseball/logos/kia-tigers.svg'
	},
	{
		id: 'doosan',
		name: '두산 베어스',
		futuresTeamName: '두산 베어스 2군',
		futuresLeague: 'north',
		color: '#1A1748',
		logoSrc: '/images/baseball/logos/doosan-bears.svg'
	},
	{
		id: 'kiwoom',
		name: '키움 히어로즈',
		futuresTeamName: '고양 히어로즈',
		futuresLeague: 'north',
		color: '#570514',
		logoSrc: '/images/baseball/logos/kiwoom-heroes.svg'
	},
	{
		id: 'sangmu',
		name: '상무 피닉스 야구단',
		futuresLeague: 'north',
		color: '#EAB146',
		logoSrc: '/images/baseball/logos/sangmu-phoenix.svg'
	},
	{
		id: 'ulsan',
		name: '울산 웨일즈',
		futuresLeague: 'south',
		color: '#C70000',
		logoSrc: '/images/baseball/logos/ulsan-whales.svg'
	}
] as const satisfies readonly BaseballTeam[]

type BaseballTeamId = (typeof BASEBALL_TEAMS)[number]['id']

const BASEBALL_TEAMS_BY_ID = new Map<string, BaseballTeam>(BASEBALL_TEAMS.map((team) => [team.id, team]))

function getBaseballTeamById(id: string): BaseballTeam | undefined {
	return BASEBALL_TEAMS_BY_ID.get(id.toLowerCase())
}

function getBaseballTeamsByIds(ids: readonly string[]): BaseballTeam[] {
	return ids.flatMap((id) => {
		const team = getBaseballTeamById(id)
		return team ? [team] : []
	})
}

function getBaseballTeamUsageName(team: BaseballTeam, level: BaseballTeamLevel): string {
	if (level === 'second') {
		return team.futuresTeamName ?? team.name
	}

	return team.name
}

export {
	BASEBALL_FUTURES_LEAGUE_LABEL,
	BASEBALL_TEAMS,
	getBaseballTeamById,
	getBaseballTeamsByIds,
	getBaseballTeamUsageName
}
export type { BaseballFuturesLeague, BaseballTeam, BaseballTeamId, BaseballTeamLevel }
