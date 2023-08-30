import React, {useState, createContext, useContext} from 'react'

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [cardTheme, setCardTheme] = useState('playingCards');
  const [showNames, setShowNames] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCardsClicked, setShowCardsClicked] = useState(false);

  const handleCardTheme = (e) => {
    setCardTheme(e.target.value);
  }

  const handleShowNames = (e) => {
    setShowNames(e.target.checked);
  }

  const handleShowAdvanced = () => {
    setShowAdvanced(s => !s);
    setShowCardsClicked(s => !s);
  }

  return (
    <SettingsContext.Provider 
      value={{
        cardTheme, handleCardTheme,
        showNames, handleShowNames,
        showAdvanced, handleShowAdvanced,
        showCardsClicked,
      }}>
        {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);