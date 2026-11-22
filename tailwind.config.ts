import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kr: {
          green: "#15803d",
          darkgreen: "#14532d",
          lightgreen: "#f0fdf4",
          amber: "#d97706",
          red: "#b91c1c",
          earth: "#78350f"
        }
      }
    },
  },
  plugins: [],
};
export default config;
