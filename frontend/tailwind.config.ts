import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
          colors: {
            background: {
              DEFAULT: "#f8fafc",
            },
            foreground: {
              DEFAULT: "#334155",
            },
            primary: {
              DEFAULT: "#2563eb",
            },
            secondary: {
              DEFAULT: "#64748b",
            },
            default: {
              100: "#f5f5f5", // input background
              600: "#2563eb", // input labels
              200: "#f4f4f4", // input border
              400: "#2563ebaa", // input border focus
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
