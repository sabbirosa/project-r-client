import { defineConfig } from '@tailwindcss/vite'

export default defineConfig({
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  // In Tailwind v4, dark mode and custom colors are configured in CSS, not here
})
