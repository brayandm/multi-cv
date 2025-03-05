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
          // ...
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
