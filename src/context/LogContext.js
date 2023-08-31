import { useCallback } from "react";
import { createContext, useContext, useState } from "react";

export const LogContext = createContext();

export const LogProvider = ({ children }) => {
    
  const [logs, setLogs] = useState([]);
  
  const logToTextArea = useCallback((message) => {
    setLogs(l => [...l, message]);
  }, [])

return (
  <LogContext.Provider value={{logs, logToTextArea}}>
      {children}
  </LogContext.Provider>
);
};

export const useLogContext = () => useContext(LogContext);