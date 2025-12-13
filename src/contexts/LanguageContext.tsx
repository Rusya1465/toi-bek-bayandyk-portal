
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
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

// Map language codes to database suffixes
const langToDbSuffix: Record<"ky" | "ru", string> = {
  ky: "kg", // Kyrgyz language uses _kg suffix in DB
  ru: "ru"  // Russian uses _ru suffix
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<"ky" | "ru">(() => {
    try {
      const savedLanguage = localStorage.getItem("toibek_language");
      console.log('🌐 LanguageProvider: Loaded language from localStorage:', savedLanguage);
      return (savedLanguage === "ky" || savedLanguage === "ru") ? savedLanguage : defaultLanguage;
    } catch (error) {
      console.error('🌐 LanguageProvider: Error accessing localStorage:', error);
      return defaultLanguage;
    }
  });

  // Wrapper for setLanguage with logging
  const setLanguage = useCallback((newLanguage: "ky" | "ru") => {
    console.log('🌐 LanguageProvider: Changing language from', language, 'to', newLanguage);
    setLanguageState(newLanguage);
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem("toibek_language", language);
      console.log('🌐 LanguageProvider: Saved language to localStorage:', language);
    } catch (error) {
      console.error('🌐 LanguageProvider: Error saving to localStorage:', error);
    }
    // Update document language for accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Function to get a nested translation by key path (e.g., "nav.home")
  const t = useCallback((key: string): string => {
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
  }, [language]);

  // Function to get localized content from database items
  const getLocalizedField = useCallback(<T extends Record<string, any>>(item: T, field: string): string => {
    if (!item) {
      console.log('🌐 getLocalizedField: item is null/undefined');
      return "";
    }
    
    // Get the correct database suffix for current language
    const dbSuffix = langToDbSuffix[language];
    const localizedFieldName = `${field}_${dbSuffix}`;
    
    console.log('🌐 getLocalizedField:', { field, language, dbSuffix, localizedFieldName, value: item[localizedFieldName], fallback: item[field] });
    
    // First try to get the localized field based on current language
    if (item[localizedFieldName] !== undefined && item[localizedFieldName] !== null && item[localizedFieldName] !== "") {
      return item[localizedFieldName];
    }
    
    // Otherwise fallback to the default field (without suffix)
    if (item[field] !== undefined && item[field] !== null && item[field] !== "") {
      return item[field];
    }
    
    // If all else fails, return empty string
    return "";
  }, [language]);

  // Function to format field name based on language (for form inputs)
  const formatFieldName = useCallback((field: string, lang?: "ky" | "ru"): string => {
    const langToUse = lang || language;
    const dbSuffix = langToDbSuffix[langToUse];
    // For Kyrgyz (default), we use the base field; for Russian, we add _ru suffix
    return langToUse === defaultLanguage ? field : `${field}_${dbSuffix}`;
  }, [language]);

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
