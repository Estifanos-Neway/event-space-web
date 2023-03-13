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
        secondary: "",
        background: "#FFFFFF",
        surface: "#ECECEC",
        error: "#CE0000",
        thin_gray: "#BFBFBF",
        on: {
          primary: "#EBEBEB",
          secondary: "",
          background: "#474747",
          surface: "343434",
        },
        dark: {
          background: "#343434",
          surface: "",
          thin_gray: "#BFBFBF",
          on: {
            background: "#F5F5F5",
            surface: "",
          }
        }
      },
      fontFamily: {
        logo: "Rajdhani"
      }
    },
  },
  plugins: [
    require('flowbite')
  ],
}
