import { BaseballIcon } from '@phosphor-icons/react/dist/ssr/Baseball'
import { Plane, PlaneTakeoff } from 'lucide-react'

import ThemeMapEntryCard from '@/features/theme-maps/components/theme-map-entry-card'
import { THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'

function ThemeMapsHomeSection() {
	return (
		<section className="grid grid-cols-1 gap-6 px-6 md:grid-cols-2 md:px-6">
			<ThemeMapEntryCard
				href={THEME_MAPS_ROUTES.airports}
				title="공항 날씨"
				icon={Plane}
				iconClassName="rotate-45"
				decoIcon={PlaneTakeoff}
				variant="airport"
			/>
			<ThemeMapEntryCard
				href={THEME_MAPS_ROUTES.baseball}
				title="야구장 날씨"
				icon={BaseballIcon}
				decoIconClassName="rotate-45"
				variant="baseball"
			/>
		</section>
	)
}

export default ThemeMapsHomeSection
