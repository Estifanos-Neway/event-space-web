import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./node_modules/flowbite.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A500CE",
        background: "#F5F5F5",
        onBackground: "#343434",
        backgroundDark: "#343434",
        onBackgroundDark: "#F5F5F5",
      }
    },
  },
  plugins: [
    require('flowbite')
  ],
}
