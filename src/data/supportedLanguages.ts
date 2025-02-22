export const supportedLanguages = {
  spanish: {
    name: "Spanish",
    flag: "🇪🇸",
    languageCode: "es",
    colors: {
      primary: "bg-[#F1BF00] hover:bg-[#DFB200] text-black",
      secondary: "bg-[#C60B1E] hover:bg-[#B00A1B] text-white",
    },
  },
  french: {
    name: "French",
    flag: "🇫🇷",
    languageCode: "fr",
    colors: {
      primary: "bg-[#002395] hover:bg-[#001B70] text-white",
      secondary: "bg-[#ED2939] hover:bg-[#D62533] text-white",
    },
  },
  german: {
    name: "German",
    flag: "🇩🇪",
    languageCode: "de",
    colors: {
      primary: "bg-[#000000] hover:bg-[#1A1A1A] text-white",
      secondary: "bg-[#DD0000] hover:bg-[#C70000] text-white",
    },
  },
  italian: {
    name: "Italian",
    flag: "🇮🇹",
    languageCode: "it",
    colors: {
      primary: "bg-[#002395] hover:bg-[#001B70] text-white",
      secondary: "bg-[#ED2939] hover:bg-[#D62533] text-white",
    },
  },
  portuguese: {
    name: "Portuguese",
    flag: "🇵🇹",
    languageCode: "pt",
    colors: {
      primary: "bg-[#002395] hover:bg-[#001B70] text-white",
      secondary: "bg-[#ED2939] hover:bg-[#D62533] text-white",
    },
  },
} as const;

export const supportedLanguagesArray = Object.values(supportedLanguages);

export type SupportedLanguageData = (typeof supportedLanguagesArray)[number];
