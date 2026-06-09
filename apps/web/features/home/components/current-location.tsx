import { Crosshair, Star } from 'lucide-react'

function CurrentLocation() {
	return (
		<div className="flex items-center gap-3 text-xl font-bold">
			<div className="flex items-center gap-2">
				<span>
					<Star fill="var(--color-grayscale-300)" stroke="var(--color-grayscale-300)" />
				</span>
				<h2>경기도 수원시 권선구 서둔동</h2>
				<span>
					<Crosshair stroke="var(--color-pastel-blue-600)" />
				</span>
			</div>
		</div>
	)
}

export default CurrentLocation
