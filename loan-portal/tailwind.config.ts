import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16a34a", // green-600
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#0f172a", // slate-900
          foreground: "#f8fafc", // slate-50
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
