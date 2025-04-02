import { createContext, useState, useContext, ReactNode } from 'react';
import { Texts } from '../constants/Texts.ts';
import axios from 'axios';
import { session } from '../models/interfaces.tsx';

// Define the type for our context

// Define the type for the session if needed

interface AppContextType {
  language: 'en' | 'es';
  Texts: typeof Texts['en'] | typeof Texts['es'];
  toggleLanguage: () => void;
  modalPaymentOpen: boolean;
  setModalPaymentOpen: (isOpen: boolean) => void;
  IsSuccess: boolean;
  setIsSuccess: (isSuccess: boolean) => void;
  session: session | null; // Define session type here if needed
  getSession: () => void;
  setSession: (session: session | null) => void; // Define session type here if needed
  handleLogout: () => void; // Define handleLogout type here if needed
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
  handleLogout: () => {},
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
  const [session, setSession] = useState<session|null>(null); // Define session state here if needed

  const getSession = () => {
    axios.get(`${import.meta.env.VITE_URL_SERVER}/getsession`, {withCredentials: true})
    .then((response) => {
      // Make a copy of the user data
            if (!response.data.user) {
        console.log("sessiones vacias:", response.data);
        return;
      }
      // Extract _id and rename it to id using destructuring
      const { _id, ...restUserData } = response.data.user;
      const userData = { id: _id, ...restUserData };
      
      // Format the date if it exists
      if (userData.createAt) {
        const date = new Date(userData.createAt);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        userData.createAt = `${day}/${month}/${year}`;
      }
      
      setSession(userData);
      console.log("Session data:", userData);
    })
    .catch((error) => {
      console.error("Error fetching session:", error);
    });
  }

  const handleLogout = () => {
    axios.get(`${import.meta.env.VITE_URL_SERVER}/logout`, {withCredentials: true})
    .then((response) => {
      setSession(null);
      console.log("Logout successful:", response.data);
    })
    .catch((error) => {
      console.error("Error during logout:", error);
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
        handleLogout, // Pass handleLogout function to context
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);