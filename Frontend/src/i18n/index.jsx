import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import koCommon from './locales/ko/common.json';
import koAuth from './locales/ko/auth.json';
// import koUser from './locales/ko/user.json';
// import koCompany from './locales/ko/company.json';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
// import enUser from './locales/en/user.json';
// import enCompany from './locales/en/company.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false
    },
    resources: {
      ko: {
        common: koCommon,
        auth: koAuth
        // user: koUser,
        // company: koCompany
      },
      en: {
        common: enCommon,
        auth: enAuth
        // user: enUser,
        // company: enCompany
      }
    }
  });

export default i18n;
