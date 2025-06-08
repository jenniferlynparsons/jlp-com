/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			center: true,
		},
		borderWidth: {
			DEFAULT: '1px',
			'0': '0px',
			'2': '2px',
			'4': '4px',
			'8': '8px',
			'header': '24px',
			'navbar': '1px',
			'navlink': '2px',
			'subfooter': '4px',
			'footer' : '8px',
			'definition-list': '1px',
			'note': '6px',
		},
		colors: {
			'jlp-blue': '#49819b',
			'jlp-amber': '#cfc8b3',
			'jlp-nymph': '#7ba1a2',
			'jlp-white': '#ffffff',
			'jlp-black': '#222222',
			'jlp-navy': '#182740',
			'jlp-burnt': '#d67d45',
			'jlp-amber-light': '#f9f7f3',
		  },
		fontFamily: {
			serif: ['Georgia', 'serif'],
		},
		textColor: {
			'jlp-blue': '#49819b',
			'jlp-amber': '#cfc8b3',
			'jlp-nymph': '#7ba1a2',
			'jlp-white': '#ffffff',
			'jlp-black': '#222222',
			'jlp-navy': '#182740',
			'jlp-burnt': '#d67d45',
		},
		extend: {
			typography: {
				DEFAULT: {
				  css: {
					color: '#222',
					a: {
					  color: '#49819b',
					  '&:hover': {
						color: '#7ba1a2',
					  },
					},
				  },
				},
			  },
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		function({ addBase }) {
			addBase({
			'h1, h2, h3, h4, h5, h6': { fontFamily: 'Georgia' },
			})
	  	}
	],
}
