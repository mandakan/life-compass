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
        new_life_area: "Nytt livsområde",
        name_is_required: "Namn är obligatoriskt.",
        drag_to_reorder_life_area: "Dra och släpp för att ändra ordning på livsområden.",
        reset_life_compass_warning: "Är du säker på att du vill återställa livsområden till standard?",
        continue: "Fortsätt",
        click_to_edit_details: "Klicka för att redigera detaljer",
        delete: "Ta bort",
        remove_life_area_warning: "Varning: Detta kommer att ta bort livsområdet och alla dess data. Vill du fortsätta?",
        enter_life_area_name: "Ange livsområdesnamn",
      }
    }
  }
});

export default i18n;
