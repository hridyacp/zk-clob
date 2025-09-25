/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ['"Minecraftia"', 'sans-serif'],
      },
      colors: {
        // Minecraft-themed colors
        'mc-dark': '#1E1E1E', // Base dark background
        'mc-stone': '#7F7F7F', // Neutral gray for secondary elements
        'mc-dirt': '#593D29', // Brown for subtle accents
        'mc-grass': '#5A832E', // Green for success states
        'mc-blue': '#4A76E8', // Vibrant blue for primary accents
        'mc-green': '#51A94A', // Success and checkmark color
        'mc-red': '#C24131', // Error or warning states
        // Map component colors to Minecraft palette
        'gray': {
          700: '#3F3F3F', // Lighter than mc-dark for secondary backgrounds
          800: '#2A2A2A', // Slightly lighter than mc-dark for inputs
          900: '#1E1E1E', // Matches mc-dark
        },
        'indigo': {
          100: '#A3BFFA', // Light indigo for text
          200: '#7F9CF5', // Lighter indigo for labels
          300: '#6B7280', // Placeholder color
          400: '#4A76E8', // Matches mc-blue for consistency
          500: '#3B5BDB', // Slightly darker for borders
          600: '#2C3EAA', // Hover states
        },
        'purple': {
          600: '#6B46C1', // Primary button gradient
          700: '#553C9A', // Hover state for buttons
        },
        'emerald': {
          400: '#51A94A', // Matches mc-green for success states
        },
      },
      boxShadow: {
        'block': 'inset -4px -4px rgba(0,0,0,0.25)',
        'block-hover': 'inset -6px -6px rgba(0,0,0,0.35)',
        'block-inset': 'inset 4px 4px rgba(0,0,0,0.25)',
        'mc-glow': '0 0 8px rgba(74, 118, 232, 0.5)', // Blue glow for hover effects
      },
      backgroundImage: {
        'mc-gradient': 'linear-gradient(to right, #4A76E8, #6B46C1)', // Matches indigo-400 to purple-600
      },
    },
  },
  plugins: [],
}
