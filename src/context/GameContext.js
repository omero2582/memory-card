import React from 'react'
import { useState, useEffect, createContext, useContext } from 'react';
import useCards from '../useCards/useCards';
import { useDispatch, useSelector } from 'react-redux';
import { logToTextArea } from '../store/slices/logsSlice';
import { setCardsList, shuffleCardsThisLevel } from '../store/slices/gameSlice';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️

export const GameContext = createContext(
  {
    error: null, isLoading: false,
  });


export default function GameProvider({children}) {
  
  console.log('Game CONTEXT');
  
  const { cardTheme, level, cardsList  } = useSelector((state) => state.game);
  const dispatch = useDispatch();


  // Load cards when cardTheme changes
  const { isLoading, error } = useCards(cardTheme);

  // Effects
  // everytime level or cardsList changes, set cardsThisLevel
  useEffect(() => {
    console.log('EFFECT');

      // Slice automatically uses array.length when you go over the limit
      const numCards = 2 + 2 * level;
      const subset = cardsList.slice(0, numCards);
    // setCardsThisLevel(pickCards());
    // NEW
    dispatch(shuffleCardsThisLevel(subset));
    // Problem here... shuffle cards calls its own 'setCardsThisLevel', which is racing with
    // the setCardsThisLevel right on top of this statement
  }, [level, cardsList])

  return (
    <GameContext.Provider
      value={{
        error, isLoading,}}>

      {children}
    </GameContext.Provider>
  )
}
