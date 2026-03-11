import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }) {

  const [langue, setLangue] = useState("fr");

  return (
    <LanguageContext.Provider value={{ langue , setLangue }}>
      {children}
    </LanguageContext.Provider>
  )
}