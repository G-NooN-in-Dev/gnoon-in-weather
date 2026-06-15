import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Storybook 10 + Vite 빌더용 Tailwind v4 설정.
 * PostCSS 대신 Vite 플러그인을 사용해 HMR과 빌드 성능을 개선합니다.
 */
export default defineConfig({
	plugins: [tailwindcss()]
})
