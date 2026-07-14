import Link from 'next/link'

function WeatherApiCredit() {
	return (
		<div className="flex gap-1">
			<span>제공 : </span>
			<Link
				href="https://www.weatherapi.com/"
				target="_blank"
				rel="noopener noreferrer"
				className="text-pastel-blue-700 hover:underline"
			>
				WeatherAPI
			</Link>
		</div>
	)
}

export default WeatherApiCredit
