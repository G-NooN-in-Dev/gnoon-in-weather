import Link from 'next/link'

type LogoProps = {
	/** 모바일 Sheet가 열린 채로 로고를 눌렀을 때 패널을 닫습니다 */
	onNavigate?: () => void
}

function Logo({ onNavigate }: LogoProps) {
	return (
		<div className="flex items-baseline gap-3">
			<Link href="/" className="inline-block" aria-label="G-NooN 메인으로 이동" onClick={onNavigate}>
				<span className="from-pastel-red-700 via-pastel-green-700 to-pastel-blue-800 inline-block translate-y-0.5 bg-linear-to-r bg-clip-text text-3xl leading-none font-bold text-transparent">
					G
				</span>
			</Link>
			<Link href="/" className="inline-block" aria-label="날씨 메인으로 이동" onClick={onNavigate}>
				<span className="text-2xl font-bold tracking-wider">날씨</span>
			</Link>
		</div>
	)
}

export default Logo
