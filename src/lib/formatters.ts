import {
  SupportedLanguageCode,
  SupportedLanguageData,
  supportedLanguages,
} from "@/data/supportedLanguages";

const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export function formatCompactNumber(number: number) {
  return compactNumberFormatter.format(number);
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatLanguageName(language: SupportedLanguageData) {
  return `${language.name} ${language.flag}`;
}

export function formatLangNameByCode(code: SupportedLanguageCode) {
  return supportedLanguages[code].formatName();
}
