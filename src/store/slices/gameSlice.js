import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logToTextArea } from "./logsSlice";

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️

const initialState = {
  cardsList: [],
  //
  cardTheme: 'playingCards',
  cardsThisLevel: [], 
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
    cardsClickedSelect: (state) => state.cardsThisLevel.filter(c => c.isClicked === true)
  },
  reducers: {
    setCardTheme: (state, action) => {
      state.cardTheme = action.payload;
      state.score = 0;
    },
    setCardsThisLevel: (state, action) => {
      state.cardsThisLevel = action.payload;
      // state.cardsClicked = state.cardsThisLevel.filter(c => c.isClicked === true);
    }, 
    setCardsList: (state, action) => {
      state.cardsList = action.payload;
    },
    setScore: (state, action) => {
      state.score = action.payload;
      if (action.payload > state.highScore){
        state.highScore = action.payload
      }
    },
    // setHighScore: (state, action) => {
    //   state.highScore = action.payload;
    // },
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    setIsFlipped: (state, action) => {
      state.isFlipped = action.payload;
    },
    setIsGameOver: (state, action) => {
      state.isGameOver = action.payload;
    },
    newGame: (state, action) => {
      // resetCardsClicked();
      state.score = 0;
      state.level = 1
      state.cardsList = shuffleArr(state.cardsList)
      state.isGameOver = false;
    },
    resetCardsClicked: (state, action) => {
      state.cardsThisLevel = state.cardsThisLevel.map(c => ({...c, isClicked: false}));
      // Seems I dont need this, since everytime level or cardTheme changes, I am
      // running an Effect that takes a subset out of the initial cardsList, and
      // sets that as the cardsThisLevel. But cardsList has 'isClicked: false' 
      // and this never changes
    },
    nextLevel: (state, action) => {
      state.level = state.level + 1;
      state.score = 0
    },
    gameOver: (state, action) => {
      const character = action.payload;
      state.isGameOver = true;
      state.cardsThisLevel = state.cardsThisLevel.map(c => {
        if(c.id === character.id){
          return ({...character, isDoubleClicked: true})
        }else {
          return c;
        }
      })
    },
  },

  // NOTE -- REDUCERS & EXTRAREDUCERS CANNOT DISPATCH !!!, this must be done in thunk or middleware !!
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
  //       // Dispatch the thunk directly from extraReducers
  //       // action.asyncDispatch(myManualThunk());
  //       // action.asyncDispatch(effectSubstitute());
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

// Manual Thunks
// TODO rethink approach of entire file, but speciifcally below:
// There are some thunk that were just created ENTIRELY beacause I wanted to call dispatch(log),
// is there a simpler way so I can keep these functions inside of my createSlice redux above ?? middleware??

// OR BASICALLY, what is the easiest way to recycle code between RTK actions???
// uses setCardTheme, newGame, + logs
// export const handleCardTheme = (cardTheme) => (dispatch, getState) => {
//   const { setCardTheme, newGame } = gameSlice.actions;
//   dispatch(setCardTheme(cardTheme));
//   // dispatch(logToTextArea(`Card theme set: ${cardTheme}`));
//   const state = getState().game;
//   if (state.isGameOver) {
//     dispatch(newGame());
//   }
// };

// uses setCardTheme, newGame, + logs
export const handleCardTheme = createSyncThunk(
  'game/handleCardTheme',
  (dispatch, getState, cardTheme) => {
    const { setCardTheme, newGame } = gameSlice.actions;
    dispatch(setCardTheme(cardTheme));
    const state = getState().game;
    if (state.isGameOver) {
      dispatch(newGame());
    }
  }
);


// just logs
// export const nextLevel =  createSyncThunk(
//   'game/nextLevel',
//   (dispatch, getState, payload) => {
//     const { level } = getState().game;
//     const { setScore, setLevel } = gameSlice.actions;

//     // dispatch(logToTextArea(`Level ${level + 1}`));
//     dispatch(setScore(0));
//     dispatch(setLevel(level + 1));
//     // resetCardsClicked(); // dont need this bc pickCards useEffect() when level or cardTheme changes
//   }
// );

// // just logs
// export const nextLevel = createAsyncThunk(
//   'game/nextLevel',
//   async (payload, {dispatch, getState}) => {
//     const { level } = getState().game;
//     const { setScore, setLevel } = gameSlice.actions;

//     dispatch(logToTextArea(`Level ${level + 1}`));
//     dispatch(setScore(0));
//     dispatch(setLevel(level + 1));
//     // resetCardsClicked(); // dont need this bc pickCards useEffect() when level or cardTheme changes
//   }
// );


// uses async for timeout, needs to be here
// export const shuffleCardsThisLevel = (newCards) => async (dispatch, getState) => { 
// shouldnt use above because it doesnt dispatch ANY of action.type/.fufilled/.rejected/.settled, so cant use lestener/middlware with it
export const shuffleCardsThisLevel = createAsyncThunk(
  'game/shuffleCardsThisLevel',
  async (newCards, { dispatch, getState }) => {
    const { setIsFlipped, setCardsThisLevel } = gameSlice.actions

    dispatch(setIsFlipped(true));
    const { cardsThisLevel } = getState().game;
    if (cardsThisLevel.length !== 0){
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    dispatch(setCardsThisLevel(shuffleArr(newCards || cardsThisLevel)))
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    dispatch(setIsFlipped(false))
})

// just logs
// export const gameOver = (character) => (dispatch, getState) => {
//   const { setIsGameOver, setCardsThisLevel } = gameSlice.actions
//   const { cardsThisLevel } = getState().game;

//   dispatch(logToTextArea(`Game Over, Already Clicked ${character.name}`));
//   dispatch(setIsGameOver(true));
//   dispatch(setCardsThisLevel(cardsThisLevel.map(c => {
//     if(c.id === character.id){
//       return ({...character, isDoubleClicked: true})
//     }else {
//       return c;
//     }
//   })));
  
// };

// calls nextLevel(), gameOver() and shuffleaCards(), needs to be here
export const handleCardClick = (card) => (dispatch, getState) => {
  const { score, highScore, cardsThisLevel } = getState().game;
  const { setScore, setCardsThisLevel, nextLevel } = gameSlice.actions;
  if(card.isClicked) { 
    dispatch(gameOver(card));
  }else {
    // sucessful selection
    dispatch(logToTextArea(`${card.name} selected`));
    dispatch(setScore(score + 1));

    if(score + 1 === cardsThisLevel.length){
      dispatch(nextLevel());
    } else {
      // continue on same level
      dispatch(setCardsThisLevel(cardsThisLevel.map(c => {
        if(c.id === card.id){
          return ({...card, isClicked: true})
        }else {
          return c;
        }
      })))

      dispatch(shuffleCardsThisLevel());
    }
  }
};

export const effectSubstitute = (payload) => (dispatch, getState) => {
  const { level, cardsList } = getState().game;
  const numCards = 2 + 2 * level;
  const subset = cardsList.slice(0, numCards);
  dispatch(shuffleCardsThisLevel(subset));

  console.log('AJSHDJASHDKJASHDKJAHKSDJ')
};



export const { cardsClickedSelect } = gameSlice.selectors;

export const { 
  setCardsThisLevel,
  setCardsList,
  setScore,
  setLevel,
  setIsFlipped,
  setIsGameOver,
  newGame,
  nextLevel,
  gameOver
} = gameSlice.actions;
export default gameSlice.reducer;
