/** @type {import('tailwindcss').Config} */
const { heroui } = require('@heroui/theme');

module.exports = {
  content: [
    './src/**/*.{js,jsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,mjs}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#10231D',
        forest: '#17493B',
        copper: '#B87333',
        paper: '#F7F2E8',
      },
    },
  },
  plugins: [
    heroui({
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      themes: {
        light: {
          colors: {
            background: '#FFFFFF',
            foreground: '#16241F',
            primary: {
              DEFAULT: '#17493B',
              foreground: '#FFFFFF',
              50: '#EFF5F2',
              100: '#DCEBE5',
              200: '#BBD7CC',
              300: '#8FBBA9',
              400: '#5F9A83',
              500: '#3C7C64',
              600: '#2A6353',
              700: '#17493B',
              800: '#123A30',
              900: '#0C2A22',
            },
            secondary: {
              DEFAULT: '#B87333',
              foreground: '#FFFFFF',
              50: '#FBF3EA',
              100: '#F4E6D6',
              200: '#EACCAE',
              300: '#DEAD82',
              400: '#CE8F57',
              500: '#B87333',
              600: '#9C5E27',
              700: '#7C491F',
              800: '#5D3718',
              900: '#3F2510',
            },
            focus: '#B87333',
            success: '#2E7D5B',
            warning: '#B07A26',
            danger: '#B0472F',
          },
        },
      },
    }),
  ],
};
