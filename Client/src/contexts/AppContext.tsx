import { createContext, useState, useContext, ReactNode } from 'react';
import { Texts } from '../constants/Texts.ts';

// Define the type for our context
interface AppContextType {
  language: 'en' | 'es';
  Texts: typeof Texts['en'] | typeof Texts['es'];
  toggleLanguage: () => void;
  modalPaymentOpen: boolean;
  setModalPaymentOpen: (isOpen: boolean) => void;
  IsSuccess: boolean;
  setIsSuccess: (isSuccess: boolean) => void;
}

// Provide a default value that matches the context type
const AppContext = createContext<AppContextType>({
  language: 'es',
  Texts: Texts['es'],
  toggleLanguage: () => {},
  modalPaymentOpen: false,
  setModalPaymentOpen: () => {},
  IsSuccess: false,
  setIsSuccess: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [language, setLanguage] = useState<'en' | 'es'>('es');
  const [modalPaymentOpen, setModalPaymentOpen] = useState<boolean>(false);
  const [IsSuccess, setIsSuccess] = useState<boolean>(false);
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'es' : 'en'));
  };

  return (
    <AppContext.Provider 
      value={{ 
        language, 
        Texts: Texts[language as keyof typeof Texts], 
        toggleLanguage,
        modalPaymentOpen,
        setModalPaymentOpen,
        IsSuccess,
        setIsSuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);