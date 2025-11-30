
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import ruTranslations from "../i18n/ru.json";
import kyTranslations from "../i18n/ky.json";

type LanguageContextType = {
  language: "ky" | "ru";
  setLanguage: (language: "ky" | "ru") => void;
  t: (key: string) => string;
  getLocalizedField: <T extends Record<string, any>>(item: T, field: string) => string;
  formatFieldName: (field: string, lang?: "ky" | "ru") => string;
};

const translations = {
  ky: kyTranslations,
  ru: ruTranslations
};

const defaultLanguage = "ky";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<"ky" | "ru">(() => {
    try {
      const savedLanguage = localStorage.getItem("language");
      console.log('📖 LanguageProvider: Loaded language from localStorage:', savedLanguage);
      return (savedLanguage === "ky" || savedLanguage === "ru") ? savedLanguage : defaultLanguage;
    } catch (error) {
      console.error('📖 LanguageProvider: Error accessing localStorage:', error);
      return defaultLanguage;
    }
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    // Update document language for accessibility
    document.documentElement.lang = language;
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

  // Function to get localized content from database items
  const getLocalizedField = <T extends Record<string, any>>(item: T, field: string): string => {
    if (!item) return "";
    
    // First try to get the localized field based on current language
    const localizedFieldName = `${field}_${language}`;
    
    // If the localized field exists and has a value, use it
    if (item[localizedFieldName]) {
      return item[localizedFieldName];
    }
    
    // Otherwise fallback to the default field
    if (item[field]) {
      return item[field];
    }
    
    // If all else fails, return empty string
    return "";
  };

  // Function to format field name based on language (for form inputs)
  const formatFieldName = (field: string, lang?: "ky" | "ru"): string => {
    const langToUse = lang || language;
    return langToUse === defaultLanguage ? field : `${field}_${langToUse}`;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      getLocalizedField,
      formatFieldName 
    }}>
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
