import React from 'react'
import { useState, useEffect, createContext, useContext } from 'react';
// import { LogContext } from './LogContext';
import useCards from '../useCards/useCards';
import { useDispatch, useSelector } from 'react-redux';
import { logToTextArea } from '../store/slices/logsSlice';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️

export const GameContext = createContext(
  {
    cardTheme: 'playingCards',
    score: 0, setScore: () => {},
    highScore: null, setHighScore: () => {},
    level: 1, setLevel: () => {},
    cardsThisLevel: [], setCardsThisLevel: () => {}, 
    isFlipped: false, setIsFlipped: () => {},
    cardsClicked:[],
    isGameOver: false, setIsGameOver: () => {},
    handleCardTheme: () => {}, handleCardClick: () => {},
    newGame: () => {}, nextLevel: () => {},
    gameOver: () => {}, shuffleCardsThisLevel: () => {},
    error: null, isLoading: false,
  });


export default function GameProvider({children}) {
  
  console.log('Game CONTEXT');
  const [cardTheme, setCardTheme] = useState('playingCards');
  const [cardsThisLevel, setCardsThisLevel] = useState([]);
  const cardsClicked = cardsThisLevel.filter(c => c.isClicked === true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // const {logToTextArea} = useContext(LogContext);
  const dispatch = useDispatch();

  const handleCardTheme = (e) => {
    setCardTheme(e.target.value);
    dispatch(logToTextArea(`Card theme set: ${e.target.value}`));
    setScore(0);
    if(isGameOver){
      newGame();
    }
  }

  const resetCardsClicked = () => {
    setCardsThisLevel(cards => cards.map(c => ({...c, isClicked: false})));
    // Seems I dont need this, since everytime level or cardTheme changes, I am
    // running an Effect that takes a subset out of the initial cardsList, and
    // sets that as the cardsThisLevel. But cardsList has 'isClicked: false' 
    // and this never changes
  }

  const shuffleCardsThisLevel = async (newCards) => {
    // ORIGINAL setCardsThisLevel(c => shuffleArr(c));

    setIsFlipped(true);
    if (cardsThisLevel.length !== 0){
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    setCardsThisLevel(c => shuffleArr(newCards || c));
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsFlipped(false);
    // TODO TODO investigate this further... right now this is creating 3 renders, 1 for each setState before each setTimeout.. which also propagates downwards on whoever uses this contexts
  }

  // Load cards when cardTheme changes
  const {cardsList, setCardsList, isLoading, error } = useCards(cardTheme);

  // Effects
  // everytime level or cardsList changes, set cardsThisLevel
  useEffect(() => {
    console.log('EFFECT');
    const pickCards = () => {
      // Slice automatically uses array.length when you go over the limit
      const numCards = 2 + 2 * level;
      const subset = cardsList.slice(0, numCards);
      return subset;
    }
    // setCardsThisLevel(pickCards());
    // NEW
    shuffleCardsThisLevel(pickCards());
    // Problem here... shuffle cards calls its own 'setCardsThisLevel', which is racing with
    // the setCardsThisLevel right on top of this statement
  }, [level, cardsList])



  // Handlers
  const nextLevel = () => {
    dispatch(logToTextArea(`Level ${level + 1}`));
    setScore(0);
    setLevel(l => l + 1);
    // resetCardsClicked(); // dont need this bc pickCards useEffect() when level or cardTheme changes
  }

  const newGame = () => {
    // resetCardsClicked();
    setScore(0);
    setLevel(1);
    setCardsList(c => shuffleArr(c));
    setIsGameOver(false)
  }

  const gameOver = (character) => {
    dispatch(logToTextArea(`Game Over, Already Clicked ${character.name}`));
    setIsGameOver(true);
    setCardsThisLevel(cards => cards.map(c => {
      if(c.id === character.id){
        return ({...character, isDoubleClicked: true})
      }else {
        return c;
      }
    }))
  }


  const handleCardClick = async (card) => {
    if(card.isClicked) { 
      gameOver(card);
    }else {
      // sucessful selection
      dispatch(logToTextArea(`${card.name} selected`));
      setScore(s => s + 1);
      if (score + 1 > highScore){
        setHighScore(score + 1);
      }
      // setIsFlipped(true);

      if(score + 1 === cardsThisLevel.length){
        nextLevel();
      } else {
        // continue on same level
        setCardsThisLevel(cards => cards.map(c => {
          if(c.id === card.id){
            return ({...card, isClicked: true})
          }else {
            return c;
          }
        }))

        // NEW
        shuffleCardsThisLevel();
      }
    }

    // Always suffle after every clicl
    // shuffleCardsThisLevel();
    // TODO TODO
    // this line creates race condition problems with the card flipping animation state
    // i think this state triggers a useEffect()... have to think about how to solve this.
  };

  return (
    <GameContext.Provider
      value={{
        error, isLoading, cardTheme, handleCardTheme,
        score, setScore, highScore,
        level, setLevel,
        cardsThisLevel, setCardsThisLevel, 
        isFlipped, setIsFlipped,
        cardsClicked,
        isGameOver, setIsGameOver,
        handleCardClick,
        newGame, nextLevel, gameOver,
        shuffleCardsThisLevel}}>

      {children}
    </GameContext.Provider>
  )
}
