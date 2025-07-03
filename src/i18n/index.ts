import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import itTranslations from './locales/it.json';
import ptTranslations from './locales/pt.json';
import nlTranslations from './locales/nl.json';
import svTranslations from './locales/sv.json';
import noTranslations from './locales/no.json';
import daTranslations from './locales/da.json';
import fiTranslations from './locales/fi.json';
import plTranslations from './locales/pl.json';
import ruTranslations from './locales/ru.json';
import zhTranslations from './locales/zh.json';
import jaTranslations from './locales/ja.json';
import koTranslations from './locales/ko.json';
import arTranslations from './locales/ar.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  it: { translation: itTranslations },
  pt: { translation: ptTranslations },
  nl: { translation: nlTranslations },
  sv: { translation: svTranslations },
  no: { translation: noTranslations },
  da: { translation: daTranslations },
  fi: { translation: fiTranslations },
  pl: { translation: plTranslations },
  ru: { translation: ruTranslations },
  zh: { translation: zhTranslations },
  ja: { translation: jaTranslations },
  ko: { translation: koTranslations },
  ar: { translation: arTranslations },
  hi: { translation: hiTranslations }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;