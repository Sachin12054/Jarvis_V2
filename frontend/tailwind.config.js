/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: '#050811',
          panel: '#0b1222',
          card: 'rgba(16, 25, 45, 0.7)',
          input: 'rgba(12, 20, 36, 0.95)',
        },
        hud: {
          cyan: '#00f0ff',
          blue: '#0077ff',
          orange: '#ff7700',
          green: '#00ffaa',
        },
      },
      fontFamily: {
        hud: ['Orbitron', 'Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        cyan: '0 0 15px rgba(0, 240, 255, 0.35)',
        orange: '0 0 15px rgba(255, 119, 0, 0.4)',
        green: '0 0 15px rgba(0, 255, 170, 0.4)',
      },
    },
  },
  plugins: [],
}
