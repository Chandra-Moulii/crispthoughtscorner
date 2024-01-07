/** @type {import(tailwindcss).Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "skin-error": "rgb(var(--error) / <alpha-value>)",
        "skin-accent": "rgb(var(--accent) / <alpha-value>)",
        "skin-color": "rgb(var(--text-color) / <alpha-value>)",
        "skin-background": "rgb(var(--background) / <alpha-value>)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        pop: "pop .2s ease",
      },
    },
  },
  darkMode: "class",
};
