// Client/context/LanguageContext.js
import { createContext, useState, useContext, ReactNode } from 'react';
import { Texts } from '../constants/Texts.ts';

// Define the type for our context
interface LanguageContextType {
  language: 'en' | 'es';
  Texts: typeof Texts['en'] | typeof Texts['es'];
  toggleLanguage: () => void;
}

// Provide a default value that matches the context type
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  Texts: Texts['en'],
  toggleLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'es' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, Texts: Texts[language as keyof typeof Texts], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);