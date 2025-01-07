import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logToTextArea } from "./logsSlice";

// TODODOODODODO
// need to change the shuffling logic, feel like there is something off about the cards clicked/list not chanign
// from 3/4 to 4/4 as soon as u click.
// Also I think in genreal the code here should be improvable by like 10x to be made much SIMPLER

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// ♠️♥️♦️♣️ Symbols in case I need these

const initialState = {
  deck: [],
  //
  cardTheme: 'playingCards',
  cardsOnBoard: [], 
  score: 0,
  highScore: 0,
  level: 1, 
  isFlipped: false, 
  isGameOver: false, 
  //
  error: null, isLoading: false,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  selectors: {
    cardsClickedSelect: (state) => state.cardsOnBoard.filter(c => c.isClicked === true)
  },
  reducers: {
    setCardTheme: (state, { payload }) => {
      state.cardTheme = payload;
      state.score = 0;  /// <--- ???? in the ahdnleCArdTheme i also call newGame() so,,, ???
      state.level = 1;
    },
    setDeck: (state, { payload }) => {
      state.deck = payload;
      console.log('SET DECK')
    },
    setCardsOnBoard: (state, { payload }) => {
      state.cardsOnBoard = payload;
      console.log('SET CARDS THIS LEVEL', payload)
      // state.cardsClicked = state.cardsThisLevel.filter(c => c.isClicked === true);
    }, 
    setScore: (state, { payload }) => {
      state.score = payload;
      if (payload > state.highScore){
        state.highScore = payload
      }
    },
    nextLevel: (state, action) => {
      state.level = state.level + 1;
      state.score = 0
    },
    setIsFlipped: (state, { payload }) => {
      state.isFlipped = payload;
    },
    newGame: (state, action) => {
      // resetCardsClicked();
      state.score = 0;
      state.level = 1
      state.deck = shuffleArr(state.deck)
      state.isGameOver = false;
    },
    gameOver: (state, { payload }) => {
      const character = payload;
      state.isGameOver = true;
      state.cardsOnBoard = state.cardsOnBoard.map(c => {
        if(c.id === character.id){
          return ({...character, isDoubleClicked: true})
        }else {
          return c;
        }
      })
    },
    
    // below reducers are all not used anywhere
    // setHighScore: (state, action) => {
    //   state.highScore = action.payload;
    // },
    // setLevel: (state, { payload }) => {
    //   state.level = payload;
    // },
    // setIsGameOver: (state, { payload }) => {
    //   state.isGameOver = payload;
    // },
    // resetCardsClicked: (state, action) => {
    //   state.cardsThisLevel = state.cardsThisLevel.map(c => ({...c, isClicked: false}));
    //   // Seems I dont need this, since everytime level or cardTheme changes, I am
    //   // running an Effect that takes a subset out of the initial cardsList, and
    //   // sets that as the cardsThisLevel. But cardsList has 'isClicked: false' 
    //   // and this never changes
    // },
    
    
  },

  // NOTE -- REDUCERS & EXTRAREDUCERS CANNOT DISPATCH !!!, this must be done in thunk or middleware !!
  // The purpose of extra reducers is only to make additional state changes, in response to other actions 
  // extraReducers: (builder) => {
  //   builder.addCase(handleCardThemeThunk.pending, (state, action) => {
  //     state.cardTheme = action.payload;
  //     state.score = 0;
  //   });
  // },
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     (action) => action.type === 'game/setLevel' || action.type === 'game/setCardsList',
  //     (state, action) => {
  //       console.log('EXTRA REDUCERRR SUBSITUTE EFFFECT ======')
  //     }
  //   );
  // },
})



  // helper to create Sync thunks, simply to add a .type to be read in listenerMiddleware
  const createSyncThunk = (type, fn) => {
    const thunk = (payload) => (dispatch, getState) => {
      dispatch({ type, payload });
      fn(dispatch, getState, payload);  // Pass the payload to the action handler
    };
    thunk.type = type;
    return thunk;
  };

// Thunks below
// Manual Thunks = to combine dispatches
// Async Thunks = for async, I am using createAsyncTunk bc it comes with the action.fufilled/pending, but manual async thunk do not

// uses setCardTheme, newGame
export const handleCardTheme = createSyncThunk(
  'game/handleCardTheme',
  (dispatch, getState, cardTheme) => {
    console.log('HANDLE CARD THEME')
    const { setCardTheme, newGame } = gameSlice.actions;
    dispatch(setCardTheme(cardTheme));
    const state = getState().game;
    if (state.isGameOver) {
      dispatch(newGame());
    }
  }
);


// async for timeout, needs to be here
// export const shuffleCardsThisLevel = (newCards) => async (dispatch, getState) => { 
// shouldnt use manual async above because it doesnt dispatch ANY of action.type/.fufilled/.rejected/.settled, so cant use lestener/middlware with it
export const shuffleCardsThisLevel = createAsyncThunk(
  'game/shuffleCardsThisLevel',
  async (newCards, { dispatch, getState }) => {
    const { setIsFlipped, setCardsOnBoard } = gameSlice.actions
    console.log('SUFFLING', newCards)
    dispatch(setIsFlipped(true));
    const { cardsOnBoard } = getState().game;
    if (cardsOnBoard.length !== 0){ // <-- TODO why is this here???
      await new Promise((resolve) => setTimeout(resolve, 800)); 
    }
    dispatch(setCardsOnBoard(shuffleArr(newCards || cardsOnBoard)))
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    dispatch(setIsFlipped(false))
})

// calls shuffleaCards(), so needs to be here
export const handleCardClick = createSyncThunk(
  'game/handleCardClick',
  (dispatch, getState, card) => {
    const { score, highScore, cardsOnBoard } = getState().game;
    const { setScore, setCardsOnBoard, nextLevel } = gameSlice.actions;
    if(card.isClicked) { 
      dispatch(gameOver(card));
    }else {
      // sucessful selection
      dispatch(logToTextArea(`${card.name} selected`));
      dispatch(setScore(score + 1));

      if(score + 1 === cardsOnBoard.length){
        //
        dispatch(setCardsOnBoard(cardsOnBoard.map(c => {
          if(c.id === card.id){
            return ({...card, isClicked: true})
          }else {
            return c;
          }
        })))
        //
        dispatch(nextLevel());
      } else {
        // continue on same level
        dispatch(setCardsOnBoard(cardsOnBoard.map(c => {
          if(c.id === card.id){
            return ({...card, isClicked: true})
          }else {
            return c;
          }
        })))

        dispatch(shuffleCardsThisLevel());
      }
    }
})

export const drawCards = createSyncThunk(
  'game/drawCards',
  (dispatch, getState, cardTheme) => {
    const { level, deck } = getState().game;
    const numCards = 2 + 2 * level;
    const subset = deck.slice(0, numCards);
    console.log('DRAWING', subset)
    dispatch(shuffleCardsThisLevel(subset));
});



export const { cardsClickedSelect } = gameSlice.selectors;

export const { 
  setCardsOnBoard,
  setDeck,
  setScore,
  setIsFlipped,
  newGame,
  nextLevel,
  gameOver
} = gameSlice.actions;
export default gameSlice.reducer;
