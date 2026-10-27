import { en } from './en';
import { mr } from './mr';
import {
  translatePlanetName,
  translateZodiacSign,
  translateDignity,
  translateMotion,
  toDevanagariNumerals,
} from './astrology-terms';

export type Language = 'en' | 'mr';

export const translations: Record<Language, Record<string, string>> = {
  en,
  mr,
};

export {
  translatePlanetName,
  translateZodiacSign,
  translateDignity,
  translateMotion,
  toDevanagariNumerals,
};

/**
 * Helper to safely extract localized content from Strapi records
 * Falls back to English if Marathi field or localization is missing.
 */
export function getLocalizedField(item: any, field: string, lang: Language): string {
  if (!item) return '';

  if (lang === 'mr') {
    // 1. Direct field like title_mr, bio_mr, description_mr
    const mrField = `${field}_mr`;
    if (item[mrField] && typeof item[mrField] === 'string' && item[mrField].trim().length > 0) {
      return item[mrField];
    }

    // 2. Strapi i18n localizations array
    if (Array.isArray(item.localizations)) {
      const mrLocale = item.localizations.find(
        (loc: any) => loc.locale === 'mr' || loc.locale === 'mr-IN'
      );
      if (mrLocale && mrLocale[field]) {
        return mrLocale[field];
      }
    }
  }

  // Fallback to standard English field
  return item[field] || '';
}
