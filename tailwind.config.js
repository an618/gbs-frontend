/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    colors: {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      error: "var(--error)",
      muted: "var(--muted)",
      lightRed: "var(--lightRed)",
      lightBlue: "var(--lightBlue)",
      tertiary: "var(--tertiary)",
      transparent: "var(--transparent)",
      quaternary: "var(--quaternary)",
      white: "var(--white)",
      quinary: "var(--quinary)",
    },
  },
  plugins: [],
};
