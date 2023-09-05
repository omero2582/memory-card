import React, {useState, createContext, useContext} from 'react'
import { useCallback } from 'react';

const cardBackMap = {
  CLASSIC: 'bicycle-red.jpg',
  YUGIOH: 'yugioh.png',
  YUGIOH_CLASSIC: 'yugioh-classic.png',
  FSN_RIN: 'FSN-Rin.png',
  FSN_SABER: 'FSN-Saber.png'
}

const loadCardBack = () => {
  const key = localStorage.getItem('cardBack');
  if ( key && cardBackMap[key]){
    return key
  } else return 'CLASSIC'
}

const getCardBackURL = (cardback) => {
  return process.env.PUBLIC_URL + `/CardBacks/${cardBackMap[cardback]}`
}

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  
  const [showNames, setShowNames] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCardsClicked, setShowCardsClicked] = useState(false);
  const [cardBack, setCardBack] = useState(loadCardBack());

  const handleShowNames = (e) => {
    setShowNames(e.target.checked);
  }

  const toggleShowAdvanced = () => {
    setShowAdvanced(s => !s);
    setShowCardsClicked(s => !s);
  }

  const handleShowAdvanced = useCallback((value=true) => {
    setShowAdvanced(value);
    setShowCardsClicked(value);
  }, [])

  const handleCardBack = (cardBack) => {
    setCardBack(cardBack);
    localStorage.setItem('cardBack', cardBack)
  }

  const handleShowCardsClicked = useCallback((value = true) => {
    setShowCardsClicked(value);
  })

  return (
    <SettingsContext.Provider 
      value={{
        showNames, handleShowNames,
        showAdvanced, toggleShowAdvanced, handleShowAdvanced,
        showCardsClicked, handleShowCardsClicked,
        cardBack, cardBackMap, handleCardBack, getCardBackURL
      }}>
        {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);