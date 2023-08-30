import { createContext, useContext, useState, useEffect } from "react";
import { LogContext } from "./LogContext";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const {logToTextArea} = useContext(LogContext);

  const toggleTheme = () => {
    setTheme(t => (t === 'light') ? 'dark' : 'light')
  }

  //sync theme change to local storage & text Logs
  useEffect(() => {
    localStorage.setItem('theme', theme)
    logToTextArea(`Color theme set to: ${theme}`);
  }, [theme, logToTextArea])

return (
  <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
  </ThemeContext.Provider>
);
};

export const useThemeContext = () => useContext(ThemeContext);