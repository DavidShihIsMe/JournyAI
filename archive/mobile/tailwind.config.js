/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A7D7A",
          dark: "#15635F",
          light: "#E6F5F4",
        },
        secondary: {
          DEFAULT: "#E8845C",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          600: "#4B5563",
          800: "#1F2937",
          900: "#111827",
        },
        slider: {
          plan: "#4A5899",
          busy: "#C4853A",
          comfort: "#9A5B7A",
          immerse: "#3A8A7A",
        },
      },
      fontFamily: {
        "playfair-black": ["PlayfairDisplay_900Black"],
        "playfair-bold": ["PlayfairDisplay_700Bold"],
        "lora": ["Lora_400Regular"],
        "lora-medium": ["Lora_500Medium"],
        "lora-semibold": ["Lora_600SemiBold"],
      },
    },
  },
  plugins: [],
};
