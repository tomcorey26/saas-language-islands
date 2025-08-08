interface BaseLanguage {
  name: string;
  flag: string;
  languageCode: string;
  colors: {
    primary: string;
    secondary: string;
  };
  gradient: string;
  formatName(): string;
}

const baseLanguage: Pick<BaseLanguage, "formatName"> = {
  formatName(): string {
    return (this as BaseLanguage).name + " " + (this as BaseLanguage).flag;
  },
};

export const supportedLanguages = {
  es: {
    ...baseLanguage,
    name: "Spanish",
    flag: "🇪🇸",
    languageCode: "es",
    colors: {
      primary: "bg-[#C60B1E] hover:bg-[#B00A1B] text-white",
      secondary: "bg-[#F1BF00] hover:bg-[#DFB200] text-black",
    },
    gradient: "from-[#C60B1E] via-[#F1BF00] to-[#C60B1E]",
  },
  fr: {
    ...baseLanguage,
    name: "French",
    flag: "🇫🇷",
    languageCode: "fr",
    colors: {
      primary: "bg-[#002395] hover:bg-[#001B70] text-white",
      secondary: "bg-[#ED2939] hover:bg-[#D62533] text-white",
    },
    gradient: "from-[#002395] via-white to-[#ED2939]",
  },
  de: {
    ...baseLanguage,
    name: "German",
    flag: "🇩🇪",
    languageCode: "de",
    colors: {
      primary: "bg-[#000000] hover:bg-[#1A1A1A] text-white",
      secondary: "bg-[#FFCC00] hover:bg-[#E6B800] text-black",
    },
    gradient: "from-[#000000] via-[#DD0000] to-[#FFCC00]",
  },
  it: {
    ...baseLanguage,
    name: "Italian",
    flag: "🇮🇹",
    languageCode: "it",
    colors: {
      primary: "bg-[#009246] hover:bg-[#007A3C] text-white",
      secondary: "bg-[#CE2B37] hover:bg-[#B52530] text-white",
    },
    gradient: "from-[#009246] via-white to-[#CE2B37]",
  },
  pt: {
    ...baseLanguage,
    name: "Portuguese",
    flag: "🇵🇹",
    languageCode: "pt",
    colors: {
      primary: "bg-[#006600] hover:bg-[#005500] text-white",
      secondary: "bg-[#FF0000] hover:bg-[#E60000] text-white",
    },
    gradient: "from-[#006600] via-[#FF0000] to-[#FFD700]",
  },
} as const;

export const supportedLanguagesArray = Object.values(supportedLanguages);

export const supportedLanguageCodes = Object.values(supportedLanguages).map(
  (lang) => lang.languageCode
) as [SupportedLanguageCode];

export type SupportedLanguageData = (typeof supportedLanguagesArray)[number];

export type SupportedLanguageCode = SupportedLanguageData["languageCode"];
