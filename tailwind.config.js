const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        back: 'rgb(var(--bg-color) / <alpha-value>)',
        fore: 'rgb(var(--text-color) / <alpha-value>)',
        header: 'rgb(var(--header-bg) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}); 