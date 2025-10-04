import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zus: {
          gold: "rgb(255, 179, 79)",      // Kolor 1 - Żółto-złoty akcent
          green: "rgb(0, 153, 63)",       // Kolor 2 - Podstawowy zielony
          gray: "rgb(190, 195, 206)",     // Kolor 3 - Szary neutralny
          blue: "rgb(63, 132, 210)",      // Kolor 4 - Niebieski dodatkowy
          darkblue: "rgb(0, 65, 110)",    // Kolor 5 - Ciemnoniebieski tekst
          red: "rgb(240, 94, 94)",        // Kolor 6 - Czerwony ostrzeżenie
          black: "rgb(0, 0, 0)",          // Kolor 7 - Czarny tekst
        },
      },
    },
  },
  plugins: [],
};

export default config;

