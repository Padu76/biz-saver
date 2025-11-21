import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        foreground: "#f9fafb",
        accent: {
          DEFAULT: "#f97316",
          soft: "#fed7aa"
        }
      }
    }
  },
  plugins: []
};

export default config;
