import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B5BDB',
          'primary-dark': '#2C4ABF',
        },
        drift: { coral: '#FF6B6B' },
        local: { green: '#2FB344' },
        hype: { amber: '#F59F00' },
        risk: { red: '#E03131' },
        transit: {
          metro: '#1971C2',
          walk: '#7C8A99',
          bus: '#0CA678',
          drive: '#495057',
          taxi: '#F08C00',
          bike: '#FAB005',
          highspeed: '#C92A2A',
          flight: '#5F3DC4',
          ferry: '#1098AD',
        },
      },
      borderRadius: {
        card: '12px',
        button: '10px',
        drawer: '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'float': '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        'drawer': '0 -4px 24px rgba(0,0,0,0.12)',
        'glow': '0 0 20px rgba(59,91,219,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
