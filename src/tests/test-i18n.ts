import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "sv", // Default test language
  fallbackLng: "sv", // Fallback to Swedish in tests
  debug: false,
  interpolation: {
    escapeValue: false, // Allow HTML in translations
  },
  resources: {
    sv: {
      translation: {
        add: "Lägg till",
        add_predefined: "Lägg till fördefinierade",
        reset: "Återställ",
        save: "Spara",
        name: "Namn",
        duplicate_name_not_allowed: "Samma namn får inte användas.",
        import: "Importera",
        export: "Exportera",
        delete_all: "Ta bort alla",
        card_view: "Kortvy",
        radar_view: "Radavy",
      }
    }
  }
});

export default i18n;
