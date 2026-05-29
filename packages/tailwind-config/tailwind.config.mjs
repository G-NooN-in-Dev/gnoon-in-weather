/** @type {import('tailwindcss').Config} */
const sharedTailwindConfig = {
	darkMode: ['class'],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '0.875rem',
				xxs: '0.875rem',
				xs: '1rem',
				sm: '1.25rem',
				md: '1.5rem',
				lg: '1.5rem',
				xl: '2rem',
				'2xl': '2.5rem'
			}
		},
		screens: {
			xxs: '320px',
			xs: '480px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		extend: {
			fontFamily: {
				sans: ['Pretendard', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
				mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace']
			},
			colors: {
				red: {
					DEFAULT: '#ff87c2',
					50: '#fff7fb',
					100: '#ffeaf4',
					200: '#ffd7ea',
					300: '#ffbddf',
					400: '#ffa0d1',
					500: '#ff87c2',
					600: '#f06fb0',
					700: '#d95a9a',
					800: '#be4b83',
					900: '#9f3f6d',
					950: '#6a2a48'
				},
				orange: {
					DEFAULT: '#ffb784',
					50: '#fff9f3',
					100: '#fff0e2',
					200: '#ffe2cc',
					300: '#ffd1ad',
					400: '#ffc08f',
					500: '#ffb784',
					600: '#f2a16c',
					700: '#d98958',
					800: '#b8724b',
					900: '#955d3f',
					950: '#613b29'
				},
				yellow: {
					DEFAULT: '#ffe38a',
					50: '#fffdf3',
					100: '#fff8df',
					200: '#ffefbf',
					300: '#ffe79f',
					400: '#ffdf90',
					500: '#ffe38a',
					600: '#f1cf72',
					700: '#d7b45e',
					800: '#b7964f',
					900: '#947a42',
					950: '#62512c'
				},
				green: {
					DEFAULT: '#93e57f',
					50: '#f7fff5',
					100: '#e9ffe1',
					200: '#d7ffcb',
					300: '#c0f7b0',
					400: '#a6ef92',
					500: '#93e57f',
					600: '#7fd56a',
					700: '#6cbd58',
					800: '#5b9f4b',
					900: '#4c843f',
					950: '#305528'
				},
				blue: {
					DEFAULT: '#84caff',
					50: '#f3fbff',
					100: '#e5f5ff',
					200: '#d2ecff',
					300: '#b9e2ff',
					400: '#9ad5ff',
					500: '#84caff',
					600: '#6eb8f2',
					700: '#5b9fd4',
					800: '#4d85b2',
					900: '#426e93',
					950: '#2a4660'
				},
				purple: {
					DEFAULT: '#c6a7ff',
					50: '#faf6ff',
					100: '#f2eaff',
					200: '#e5d7ff',
					300: '#d7c1ff',
					400: '#cdb0ff',
					500: '#c6a7ff',
					600: '#b08eea',
					700: '#9674cd',
					800: '#7d60ab',
					900: '#664e8a',
					950: '#42325a'
				},
				grayscale: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
					950: '#020617'
				},
				success: {
					DEFAULT: '#22c55e',
					50: '#f0fdf4',
					100: '#dcfce7',
					500: '#22c55e',
					700: '#15803d'
				},
				warning: {
					DEFAULT: '#f59e0b',
					50: '#fffbeb',
					100: '#fef3c7',
					500: '#f59e0b',
					700: '#b45309'
				},
				danger: {
					DEFAULT: '#ef4444',
					50: '#fef2f2',
					100: '#fee2e2',
					500: '#ef4444',
					700: '#b91c1c'
				},
				info: {
					DEFAULT: '#7eaefe',
					50: '#f3fbff',
					100: '#e5f5ff',
					500: '#7eaefe',
					700: '#5b9fd4'
				}
			},
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['1rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
				xl: ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }]
			},
			borderRadius: {
				md: '0.5rem',
				lg: '0.75rem',
				xl: '1rem',
				'2xl': '1.25rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
				pill: '9999px'
			},
			spacing: {
				18: '4.5rem',
				22: '5.5rem',
				26: '6.5rem',
				30: '7.5rem',
				34: '8.5rem'
			},
			boxShadow: {
				soft: '0 2px 12px rgb(15 23 42 / 0.08)',
				card: '0 8px 30px rgb(15 23 42 / 0.12)'
			},
			maxWidth: {
				prose: '70ch',
				content: '72rem',
				reading: '65ch'
			},
			minHeight: {
				'screen-safe': '100dvh'
			},
			zIndex: {
				dropdown: '1000',
				sticky: '1100',
				modal: '1200',
				toast: '1300'
			},
			transitionTimingFunction: {
				'emphasized-in': 'cubic-bezier(0.3, 0, 1, 1)',
				'emphasized-out': 'cubic-bezier(0, 0, 0, 1)',
				'standard-productive': 'cubic-bezier(0.2, 0, 0, 1)'
			},
			transitionDuration: {
				0: '0ms',
				400: '400ms'
			},
			backgroundImage: {
				'radial-blue': 'radial-gradient(circle at top, rgb(132 202 255 / 0.2), transparent 45%)',
				'radial-pink': 'radial-gradient(circle at top, rgb(255 135 194 / 0.22), transparent 45%)',
				'radial-purple': 'radial-gradient(circle at top, rgb(198 167 255 / 0.22), transparent 45%)',
				'linear-sky': 'linear-gradient(135deg, rgb(243 251 255), rgb(229 245 255), rgb(210 236 255))',
				'linear-sunrise': 'linear-gradient(135deg, rgb(255 247 251), rgb(255 240 226), rgb(255 253 243))',
				'linear-mint': 'linear-gradient(135deg, rgb(247 255 245), rgb(233 255 225), rgb(210 236 255))',
				'mesh-soft':
					'radial-gradient(circle at 20% 20%, rgb(255 135 194 / 0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgb(132 202 255 / 0.18), transparent 42%), radial-gradient(circle at 50% 80%, rgb(147 229 127 / 0.16), transparent 42%)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	}
}

export default sharedTailwindConfig
