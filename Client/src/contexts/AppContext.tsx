import { createContext, useState, useContext, ReactNode } from 'react';
import { Texts } from '../constants/Texts.ts';
import axios from 'axios';

// Define the type for our context
interface AppContextType {
  language: 'en' | 'es';
  Texts: typeof Texts['en'] | typeof Texts['es'];
  toggleLanguage: () => void;
  modalPaymentOpen: boolean;
  setModalPaymentOpen: (isOpen: boolean) => void;
  IsSuccess: boolean;
  setIsSuccess: (isSuccess: boolean) => void;
  session: any; // Define session type here if needed
  getSession: () => void;
  setSession: (session: any) => void; // Define session type here if needed
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
  session: null,
  getSession: () => {},
  setSession: () => {},
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
  const [session, setSession] = useState<any>(null); // Define session state here if needed

  const getSession =  () => {
    axios.get("http://localhost:3000/getsession", {withCredentials: true})
    .then((response) => {
      setSession(response.data);
      console.log("Session data:", response.data);
    })
    .catch((error) => {
      console.error("Error fetching session:", error);
    });

  }

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
        getSession,
        session, // Pass session state to context
        setSession, // Pass setSession function to context
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);