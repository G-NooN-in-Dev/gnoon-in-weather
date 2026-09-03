import Link from 'next/link'

function WeatherApiCredit() {
	return (
		<div className="flex gap-1">
			<span className="text-sm md:text-base">제공 : </span>
			<Link
				href="https://www.weatherapi.com/"
				target="_blank"
				rel="noopener noreferrer"
				className="text-pastel-blue-700 text-sm hover:underline md:text-base"
			>
				WeatherAPI
			</Link>
		</div>
	)
}

export default WeatherApiCredit
