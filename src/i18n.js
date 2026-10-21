import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './translations';

// Transform the simple translations object into the format expected by i18next
// { en: { ... } } -> { en: { translation: { ... } } }
const resources = Object.keys(translations).reduce((acc, lang) => {
    acc[lang] = {
        translation: translations[lang]
    };
    return acc;
}, {});

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        keySeparator: false, // we do not use keys in form messages.welcome
        nsSeparator: false
    });

export default i18n;
