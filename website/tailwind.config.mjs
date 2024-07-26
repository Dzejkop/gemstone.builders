/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        "press-start": ['"Press Start 2P"', "cursive"],
        "fira-mono": ['"Fira Mono"', "cursive"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
