import { createSlice } from "@reduxjs/toolkit";

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️

const initialState = {
  cardTheme: 'playingCards',
  score: 0,
  highScore: 0,
  level: 1, 
  cardsThisLevel: [], 
  isFlipped: false, 
  isGameOver: false, 
  
  ///
  // figure out below
  // I think for cardsClicked, I prob have to either change this to a function
  // getCardsClicked, OR anytime I change any cards clicked status,
  // update cardsClicked using the filter fn we used in gamecontext, not sure which approach is best
  
  cardsClicked:[],
  error: null, isLoading: false,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    handleShowNames: (state, action) => {
      state.showNames = action.payload;
    },
    setScore: () => {},
    setHighScore: () => {},
    setLevel: () => {},
    setCardsThisLevel: () => {}, 
    setIsFlipped: () => {},
    setIsGameOver: () => {},
    handleCardTheme: () => {},
    handleCardClick: () => {},
    newGame: () => {},
    nextLevel: () => {},
    gameOver: () => {},
    shuffleCardsThisLevel: () => {},
  }
})

export const { handleCardBack, handleShowAdvanced, handleShowCardsClicked, handleShowNames, toggleShowAdvanced } = gameSlice.actions;
export { getCardBackURL, cardBackMap };
export default gameSlice.reducer;