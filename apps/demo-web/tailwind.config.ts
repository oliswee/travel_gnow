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
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Noto Sans SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
