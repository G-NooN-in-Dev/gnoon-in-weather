import {
	type BaseballTeamId,
	type BaseballTeamLevel,
	getBaseballTeamById,
	getBaseballTeamUsageName
} from './baseball-teams'

type BaseballParkLevel = BaseballTeamLevel

type BaseballParkHomeTeam = {
	teamId: BaseballTeamId
	level: BaseballParkLevel
	/** 1군 제2구장. 팀 이름 뒤에 '제2구장'을 붙입니다. */
	secondaryPark?: true
}

type BaseballPark = {
	id: string
	name: string
	address: string
	lat: number
	lng: number
	homeTeams: readonly BaseballParkHomeTeam[]
}

/**
 * 구장 단위 목록입니다. 같은 좌표의 울산 문수는 홈팀을 합쳐 마커가 겹치지 않게 했습니다.
 */
const BASEBALL_PARKS = [
	{
		id: 'jamsil',
		name: '서울종합운동장 야구장(잠실야구장)',
		homeTeams: [
			{ teamId: 'lg', level: 'first' },
			{ teamId: 'doosan', level: 'first' }
		],
		address: '서울 송파구 올림픽로 19-2',
		lat: 37.5121,
		lng: 127.0719
	},
	{
		id: 'gocheok',
		name: '고척 스카이돔',
		homeTeams: [{ teamId: 'kiwoom', level: 'first' }],
		address: '서울 구로구 경인로 430',
		lat: 37.4982,
		lng: 126.8671
	},
	{
		id: 'incheon-ssg',
		name: '인천 SSG 랜더스필드',
		homeTeams: [{ teamId: 'ssg', level: 'first' }],
		address: '인천 미추홀구 매소홀로 618',
		lat: 37.4369,
		lng: 126.6934
	},
	{
		id: 'suwon-kt',
		name: '수원 KT 위즈 파크',
		homeTeams: [{ teamId: 'kt', level: 'first' }],
		address: '경기 수원시 장안구 경수대로 893',
		lat: 37.2997,
		lng: 127.0098
	},
	{
		id: 'daejeon-hanwha',
		name: '대전 한화생명 볼파크',
		homeTeams: [{ teamId: 'hanwha', level: 'first' }],
		address: '대전 중구 대종로 373',
		lat: 36.316276,
		lng: 127.431537
	},
	{
		id: 'gwangju-kia',
		name: '광주-기아 챔피언스 필드',
		homeTeams: [{ teamId: 'kia', level: 'first' }],
		address: '전남광주 북구 서림로 10',
		lat: 35.168241,
		lng: 126.88906
	},
	{
		id: 'daegu-samsung',
		name: '대구 삼성 라이온즈 파크',
		homeTeams: [{ teamId: 'samsung', level: 'first' }],
		address: '대구 수성구 야구전설로 1',
		lat: 35.8411,
		lng: 128.6816
	},
	{
		id: 'pohang',
		name: '포항 야구장',
		homeTeams: [{ teamId: 'samsung', level: 'first', secondaryPark: true }],
		address: '경북 포항시 남구 희망대로 790',
		lat: 36.0077,
		lng: 129.3593
	},
	{
		id: 'changwon-nc',
		name: '창원 NC 파크',
		homeTeams: [{ teamId: 'nc', level: 'first' }],
		address: '경남 창원시 마산회원구 삼호로 63',
		lat: 35.2227,
		lng: 128.5822
	},
	{
		id: 'sajik',
		name: '부산사직종합운동장 사직 야구장',
		homeTeams: [{ teamId: 'lotte', level: 'first' }],
		address: '부산 동래구 사직로 55-32',
		lat: 35.194,
		lng: 129.0616
	},
	{
		id: 'ulsan-moonsu',
		name: '울산 문수야구장',
		homeTeams: [
			{ teamId: 'lotte', level: 'first', secondaryPark: true },
			{ teamId: 'ulsan', level: 'second' }
		],
		address: '울산 남구 문수로 44',
		lat: 35.532,
		lng: 129.266
	},
	{
		id: 'goyang-kiwoom',
		name: '고양 스포츠타운 국가대표 야구훈련장',
		homeTeams: [{ teamId: 'kiwoom', level: 'second' }],
		address: '경기 고양시 일산서구 중앙로 1601',
		lat: 37.6816,
		lng: 126.7413
	},
	{
		id: 'icheon-lg',
		name: 'LG 챔피언스파크',
		homeTeams: [{ teamId: 'lg', level: 'second' }],
		address: '경기 이천시 대월면 대평로255번길 69',
		lat: 37.2292,
		lng: 127.5054
	},
	{
		id: 'icheon-doosan',
		name: '두산 베어스파크',
		homeTeams: [{ teamId: 'doosan', level: 'second' }],
		address: '경기 이천시 백사면 원적로 668',
		lat: 37.332,
		lng: 127.457
	},
	{
		id: 'ganghwa-ssg',
		name: '강화 SSG 퓨처스필드',
		homeTeams: [{ teamId: 'ssg', level: 'second' }],
		address: '인천 강화군 길상면 길상로 242-30',
		lat: 37.6373,
		lng: 126.5
	},
	{
		id: 'seosan-hanwha',
		name: '서산 한화 이글스 훈련장',
		homeTeams: [{ teamId: 'hanwha', level: 'second' }],
		address: '충남 서산시 성연면 성연3로 240-72',
		lat: 36.825,
		lng: 126.456
	},
	{
		id: 'mungyeong-sangmu',
		name: '문경 상무 야구장',
		homeTeams: [{ teamId: 'sangmu', level: 'second' }],
		address: '경북 문경시 영순면 이목리 44',
		lat: 36.5545,
		lng: 128.2882
	},
	{
		id: 'iksan-kt',
		name: '익산 국가대표 야구훈련장',
		homeTeams: [{ teamId: 'kt', level: 'second' }],
		address: '전북 익산시 무왕로 1397',
		lat: 35.9673,
		lng: 127.0064
	},
	{
		id: 'gyeongsan-samsung',
		name: '삼성 라이온즈 볼파크',
		homeTeams: [{ teamId: 'samsung', level: 'second' }],
		address: '경북 경산시 진량읍 일연로 640',
		lat: 35.8646,
		lng: 128.8055
	},
	{
		id: 'gimhae-sangdong',
		name: '상동 야구장',
		homeTeams: [{ teamId: 'lotte', level: 'second' }],
		address: '경남 김해시 상동면 장척로 678',
		lat: 35.2982,
		lng: 128.9307
	},
	{
		id: 'masan',
		name: '마산 야구장',
		homeTeams: [{ teamId: 'nc', level: 'second' }],
		address: '경남 창원시 마산회원구 삼호로 63',
		lat: 35.221,
		lng: 128.581
	},
	{
		id: 'hampyeong-kia',
		name: '기아 챌린저스 필드',
		homeTeams: [{ teamId: 'kia', level: 'second' }],
		address: '전남광주 함평군 학교면 대곡길 88-41',
		lat: 34.991,
		lng: 126.5567
	}
] as const satisfies readonly BaseballPark[]

type BaseballParkId = (typeof BASEBALL_PARKS)[number]['id']

const BASEBALL_PARKS_BY_ID = new Map<string, BaseballPark>(BASEBALL_PARKS.map((park) => [park.id, park]))

function getBaseballParkById(id: string): BaseballPark | undefined {
	return BASEBALL_PARKS_BY_ID.get(id)
}

function hasFirstTeamParkLevel(park: BaseballPark): boolean {
	return park.homeTeams.some(({ level }) => level === 'first')
}

function getBaseballParkHomeTeamIds(park: BaseballPark): BaseballTeamId[] {
	return park.homeTeams.map(({ teamId }) => teamId)
}

function getBaseballParkHomeTeamLabel(park: BaseballPark): string {
	return park.homeTeams
		.flatMap((homeTeam) => {
			const team = getBaseballTeamById(homeTeam.teamId)
			if (!team) {
				return []
			}

			const name = getBaseballTeamUsageName(team, homeTeam.level)
			if (homeTeam.secondaryPark) {
				return [`${name} 제2구장`]
			}

			return [name]
		})
		.join(' / ')
}

export {
	BASEBALL_PARKS,
	getBaseballParkById,
	getBaseballParkHomeTeamIds,
	getBaseballParkHomeTeamLabel,
	hasFirstTeamParkLevel
}
export type { BaseballPark, BaseballParkHomeTeam, BaseballParkId, BaseballParkLevel }
