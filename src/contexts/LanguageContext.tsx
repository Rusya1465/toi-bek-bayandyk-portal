
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import ruTranslations from "../i18n/ru.json";
import kyTranslations from "../i18n/ky.json";

type LanguageContextType = {
  language: "ky" | "ru";
  setLanguage: (language: "ky" | "ru") => void;
  t: (key: string) => string;
};

const translations = {
  ky: kyTranslations,
  ru: ruTranslations
};

const defaultLanguage = "ky";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<"ky" | "ru">(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage === "ky" || savedLanguage === "ru") ? savedLanguage : defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Function to get a nested translation by key path (e.g., "nav.home")
  const t = (key: string): string => {
    const keys = key.split(".");
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  
  return context;
};
