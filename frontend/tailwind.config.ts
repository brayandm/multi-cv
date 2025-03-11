import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          // ...
          colors: {
            background: {
              DEFAULT: "#f8fafc",
            },
            foreground: {
              DEFAULT: "#334155",
            },
            primary: {
              50: "#E1F5FE",
              100: "#B3E5FC",
              200: "#81D4FA",
              300: "#4FC3F7",
              400: "#29B6F6",
              500: "#03A9F4", // Base
              600: "#039BE5",
              700: "#0288D1",
              800: "#0277BD",
              900: "#01579B",
              DEFAULT: "#03A9F4",
            },
            secondary: {
              50: "#F1E7FC",
              100: "#E3D0FA",
              200: "#CBAAF6",
              300: "#B187F0",
              400: "#A273E9",
              500: "#9C7BD8", // Base
              600: "#8C63C4",
              700: "#7A4FAE",
              800: "#693C99",
              900: "#4D2777",
              DEFAULT: "#9C7BD8",
            },
            focus: {
              DEFAULT: "#ffffff00", // transparent
            },
          },
        },
        dark: {
          // ...
          colors: {},
        },
        // ... custom themes
      },
    }),
  ],
} satisfies Config;
