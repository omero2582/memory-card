import { createContext, useContext, useState, useEffect } from "react";
import { LogContext } from "./LogContext";
import { useDispatch, useSelector } from "react-redux";
import { logToTextArea } from "../store/slices/logsSlice";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  // const {logToTextArea} = useContext(LogContext);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    setTheme(t => (t === 'light') ? 'dark' : 'light')
  }

  //sync theme change to local storage & text Logs
  useEffect(() => {
    localStorage.setItem('theme', theme)
    dispatch(logToTextArea(`Color theme set to: ${theme}`));
  }, [theme, logToTextArea])  // TODO maybe remove log toTextArea form here??

return (
  <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
  </ThemeContext.Provider>
);
};

export const useThemeContext = () => useContext(ThemeContext);