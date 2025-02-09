/** @type {import('tailwindcss').Config} */
require("dotenv").config();
import { useTheme } from "./src/composables/use-theme";

const env = process.env.VITE_APP_ENV;
const theme = useTheme(env);
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      brightness: {},
      colors: {
        primary: theme.primary,
        secondary: theme.secondary,
        word: theme.word,
        panel: theme.panel,
        "primary-lighten": theme["primary-lighten"],
        "secondary-lighten": theme["secondary-lighten"],
        "light-blue": "#F9F9FE",
        main: "#F3F3FA",
        txt: "#626262",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(105.11deg, #5680f8 43.39%, #b08bff 88.9%)",
      },
    },
  },
  plugins: [],
};
