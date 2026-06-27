import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const SUPPORTED_LANGS = ['pt', 'en', 'es'];

function detectBrowserLang() {
  const lang = navigator.language?.slice(0, 2);
  return SUPPORTED_LANGS.includes(lang) ? lang : 'pt';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('qrmaster-lang') || detectBrowserLang();
  });

  const changeLanguage = (newLang) => {
    if (SUPPORTED_LANGS.includes(newLang)) {
      setLang(newLang);
      localStorage.setItem('qrmaster-lang', newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, SUPPORTED_LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
