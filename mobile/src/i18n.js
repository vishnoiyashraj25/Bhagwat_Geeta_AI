import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import en from './locales/en.json';
import hi from './locales/hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, hi: { translation: hi } },
    lng: RNLocalize.getLocales()[0].languageCode.startsWith('hi') ? 'hi' : 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
