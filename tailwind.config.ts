import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        hamburger: "48px auto 96px",
      },
      transitionProperty: {
        "max-height": "max-height",
      },
    },
  },
  plugins: [],
} satisfies Config;
