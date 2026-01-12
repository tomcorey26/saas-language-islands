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
  en: {
    ...baseLanguage,
    name: "English",
    flag: "🇺🇸",
    languageCode: "en",
    colors: {
      primary: "bg-[#B22234] hover:bg-[#A01E30] text-white",
      secondary: "bg-[#3C3B6E] hover:bg-[#32305D] text-white",
    },
    gradient: "from-[#B22234] via-white to-[#3C3B6E]",
  },
  zh: {
    ...baseLanguage,
    name: "Chinese",
    flag: "🇨🇳",
    languageCode: "zh",
    colors: {
      primary: "bg-[#DE2910] hover:bg-[#C5250E] text-white",
      secondary: "bg-[#FFDE00] hover:bg-[#E6C800] text-black",
    },
    gradient: "from-[#DE2910] via-[#FFDE00] to-[#DE2910]",
  },
  hi: {
    ...baseLanguage,
    name: "Hindi",
    flag: "🇮🇳",
    languageCode: "hi",
    colors: {
      primary: "bg-[#FF9933] hover:bg-[#E6862D] text-white",
      secondary: "bg-[#138808] hover:bg-[#0F6B06] text-white",
    },
    gradient: "from-[#FF9933] via-white to-[#138808]",
  },
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
  ar: {
    ...baseLanguage,
    name: "Arabic",
    flag: "🇸🇦",
    languageCode: "ar",
    colors: {
      primary: "bg-[#006C35] hover:bg-[#005A2D] text-white",
      secondary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
    },
    gradient: "from-[#006C35] via-white to-[#006C35]",
  },
  bn: {
    ...baseLanguage,
    name: "Bengali",
    flag: "🇧🇩",
    languageCode: "bn",
    colors: {
      primary: "bg-[#006A4E] hover:bg-[#005A42] text-white",
      secondary: "bg-[#F42A41] hover:bg-[#D9253A] text-white",
    },
    gradient: "from-[#006A4E] via-[#F42A41] to-[#006A4E]",
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
  ru: {
    ...baseLanguage,
    name: "Russian",
    flag: "🇷🇺",
    languageCode: "ru",
    colors: {
      primary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
      secondary: "bg-[#0039A6] hover:bg-[#003194] text-white",
    },
    gradient: "from-white via-[#0039A6] to-[#D52B1E]",
  },
  ja: {
    ...baseLanguage,
    name: "Japanese",
    flag: "🇯🇵",
    languageCode: "ja",
    colors: {
      primary: "bg-[#BC002D] hover:bg-[#A50029] text-white",
      secondary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
    },
    gradient: "from-white via-[#BC002D] to-white",
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
  ko: {
    ...baseLanguage,
    name: "Korean",
    flag: "🇰🇷",
    languageCode: "ko",
    colors: {
      primary: "bg-[#CD2E3A] hover:bg-[#B5293B] text-white",
      secondary: "bg-[#0047A0] hover:bg-[#003D8F] text-white",
    },
    gradient: "from-white via-[#CD2E3A] to-[#0047A0]",
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
  tr: {
    ...baseLanguage,
    name: "Turkish",
    flag: "🇹🇷",
    languageCode: "tr",
    colors: {
      primary: "bg-[#E30A17] hover:bg-[#CC0915] text-white",
      secondary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
    },
    gradient: "from-[#E30A17] via-white to-[#E30A17]",
  },
  vi: {
    ...baseLanguage,
    name: "Vietnamese",
    flag: "🇻🇳",
    languageCode: "vi",
    colors: {
      primary: "bg-[#DA020E] hover:bg-[#C3020C] text-white",
      secondary: "bg-[#FFFF00] hover:bg-[#E6E600] text-black",
    },
    gradient: "from-[#DA020E] via-[#FFFF00] to-[#DA020E]",
  },
  pl: {
    ...baseLanguage,
    name: "Polish",
    flag: "🇵🇱",
    languageCode: "pl",
    colors: {
      primary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
      secondary: "bg-[#DC143C] hover:bg-[#C51235] text-white",
    },
    gradient: "from-white via-[#DC143C] to-white",
  },
  uk: {
    ...baseLanguage,
    name: "Ukrainian",
    flag: "🇺🇦",
    languageCode: "uk",
    colors: {
      primary: "bg-[#005BBB] hover:bg-[#0052A6] text-white",
      secondary: "bg-[#FFD500] hover:bg-[#E6C000] text-black",
    },
    gradient: "from-[#005BBB] via-[#FFD500] to-[#005BBB]",
  },
  ro: {
    ...baseLanguage,
    name: "Romanian",
    flag: "🇷🇴",
    languageCode: "ro",
    colors: {
      primary: "bg-[#002B7F] hover:bg-[#002570] text-white",
      secondary: "bg-[#CE1126] hover:bg-[#B50F21] text-white",
    },
    gradient: "from-[#002B7F] via-[#FCD116] to-[#CE1126]",
  },
  nl: {
    ...baseLanguage,
    name: "Dutch",
    flag: "🇳🇱",
    languageCode: "nl",
    colors: {
      primary: "bg-[#21468B] hover:bg-[#1E3F7D] text-white",
      secondary: "bg-[#AE1C28] hover:bg-[#9B1923] text-white",
    },
    gradient: "from-[#21468B] via-white to-[#AE1C28]",
  },
  el: {
    ...baseLanguage,
    name: "Greek",
    flag: "🇬🇷",
    languageCode: "el",
    colors: {
      primary: "bg-[#0D5EAF] hover:bg-[#0B529D] text-white",
      secondary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
    },
    gradient: "from-[#0D5EAF] via-white to-[#0D5EAF]",
  },
  cs: {
    ...baseLanguage,
    name: "Czech",
    flag: "🇨🇿",
    languageCode: "cs",
    colors: {
      primary: "bg-[#11457E] hover:bg-[#0F3E71] text-white",
      secondary: "bg-[#D7141A] hover:bg-[#C21217] text-white",
    },
    gradient: "from-[#11457E] via-white to-[#D7141A]",
  },
  hu: {
    ...baseLanguage,
    name: "Hungarian",
    flag: "🇭🇺",
    languageCode: "hu",
    colors: {
      primary: "bg-[#CD2A3E] hover:bg-[#B92537] text-white",
      secondary: "bg-[#436F4D] hover:bg-[#3C6245] text-white",
    },
    gradient: "from-[#CD2A3E] via-white to-[#436F4D]",
  },
  sv: {
    ...baseLanguage,
    name: "Swedish",
    flag: "🇸🇪",
    languageCode: "sv",
    colors: {
      primary: "bg-[#006AA7] hover:bg-[#005F96] text-white",
      secondary: "bg-[#FECC00] hover:bg-[#E5B800] text-black",
    },
    gradient: "from-[#006AA7] via-[#FECC00] to-[#006AA7]",
  },
  bg: {
    ...baseLanguage,
    name: "Bulgarian",
    flag: "🇧🇬",
    languageCode: "bg",
    colors: {
      primary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
      secondary: "bg-[#00966E] hover:bg-[#008561] text-white",
    },
    gradient: "from-white via-[#00966E] to-[#D62612]",
  },
  hr: {
    ...baseLanguage,
    name: "Croatian",
    flag: "🇭🇷",
    languageCode: "hr",
    colors: {
      primary: "bg-[#171796] hover:bg-[#151586] text-white",
      secondary: "bg-[#FF0000] hover:bg-[#E60000] text-white",
    },
    gradient: "from-[#FF0000] via-white to-[#171796]",
  },
  sk: {
    ...baseLanguage,
    name: "Slovak",
    flag: "🇸🇰",
    languageCode: "sk",
    colors: {
      primary: "bg-[#EE1C25] hover:bg-[#D51920] text-white",
      secondary: "bg-[#0B4EA2] hover:bg-[#0A4691] text-white",
    },
    gradient: "from-white via-[#0B4EA2] to-[#EE1C25]",
  },
  sl: {
    ...baseLanguage,
    name: "Slovenian",
    flag: "🇸🇮",
    languageCode: "sl",
    colors: {
      primary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
      secondary: "bg-[#FF0000] hover:bg-[#E60000] text-white",
    },
    gradient: "from-white via-[#FF0000] to-[#0000FF]",
  },
  lt: {
    ...baseLanguage,
    name: "Lithuanian",
    flag: "🇱🇹",
    languageCode: "lt",
    colors: {
      primary: "bg-[#FDB462] hover:bg-[#FCA248] text-black",
      secondary: "bg-[#006A44] hover:bg-[#005D3C] text-white",
    },
    gradient: "from-[#FDB462] via-[#006A44] to-[#C1272D]",
  },
  lv: {
    ...baseLanguage,
    name: "Latvian",
    flag: "🇱🇻",
    languageCode: "lv",
    colors: {
      primary: "bg-[#9E3039] hover:bg-[#8D2B33] text-white",
      secondary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
    },
    gradient: "from-[#9E3039] via-white to-[#9E3039]",
  },
  no: {
    ...baseLanguage,
    name: "Norwegian",
    flag: "🇳🇴",
    languageCode: "no",
    colors: {
      primary: "bg-[#BA0C2F] hover:bg-[#A50B2A] text-white",
      secondary: "bg-[#00205B] hover:bg-[#001C52] text-white",
    },
    gradient: "from-[#BA0C2F] via-white to-[#00205B]",
  },
  da: {
    ...baseLanguage,
    name: "Danish",
    flag: "🇩🇰",
    languageCode: "da",
    colors: {
      primary: "bg-[#C60C30] hover:bg-[#B10B2B] text-white",
      secondary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
    },
    gradient: "from-[#C60C30] via-white to-[#C60C30]",
  },
  fi: {
    ...baseLanguage,
    name: "Finnish",
    flag: "🇫🇮",
    languageCode: "fi",
    colors: {
      primary: "bg-[#003580] hover:bg-[#002F73] text-white",
      secondary: "bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black",
    },
    gradient: "from-white via-[#003580] to-white",
  },
} as const;

export const supportedLanguagesArray = Object.values(supportedLanguages);

export const supportedLanguagesArraySorted = [...supportedLanguagesArray].sort(
  (a, b) => a.name.localeCompare(b.name)
);

export const supportedLanguageCodes = Object.values(supportedLanguages).map(
  (lang) => lang.languageCode
) as [SupportedLanguageCode];

export type SupportedLanguageData = (typeof supportedLanguagesArray)[number];

export type SupportedLanguageCode = SupportedLanguageData["languageCode"];
