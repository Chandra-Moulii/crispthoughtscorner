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
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "transformY(0px)", opacity: "1" },
        },
      },
      animation: {
        pop: "pop .2s ease",
        slideDown300: "slideDown .9s ease 300ms forwards",
        slideDown600: "slideDown .9s ease 600ms forwards",
        slideDown900: "slideDown .9s ease 900ms forwards",
        slideDown1200: "slideDown .9s ease 1200ms forwards",
      },
    },
  },
  darkMode: "class",
};
