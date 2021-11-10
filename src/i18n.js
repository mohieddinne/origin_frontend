import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import fr_FR from './i18n/fr_FR.json';
import fr_CA from "./app/i18n/fr_CA.json";
import fr_CA_portal from "./app/i18n/fr_CA_portal.json";

// the translations
const resources = {
  "fr-CA": { translation: fr_CA, g: fr_CA_portal },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: process.env.NODE_ENV !== "production",
    resources,
    lng: "fr-CA",
    fallbackLng: "fr-CA",
    keySeparator: ".",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

if (process.env.NODE_ENV !== "production") console.log("18n init");

export default i18n;
