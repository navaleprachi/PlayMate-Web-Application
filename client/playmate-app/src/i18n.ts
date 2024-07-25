// Import necessary dependencies
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpAPI from 'i18next-http-backend';

// Initialize i18n with HttpAPI for loading translations asynchronously
i18n.use(HttpAPI)
    .use(initReactI18next)
    .init({
        lng: 'en', // Set default language
        fallbackLng: 'en', // Fallback language in case the translation is missing
        ns: ['common'], // Specify namespaces, you currently have 'common'
        backend: {
            loadPath: '/i18n/{{lng}}/{{ns}}.json'   // Define the path to your translation files
        },
        debug: true, // Enable debug mode for development
        interpolation: {
            escapeValue: false // Allow interpolation inside translation strings
        }
    });


export default i18n;