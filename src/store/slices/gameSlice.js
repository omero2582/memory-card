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
  
  ///
  // figure out below
  // I think for cardsClicked, I prob have to either change this to a function
  // getCardsClicked, OR anytime I change any cards clicked status,
  // update cardsClicked using the filter fn we used in gamecontext, not sure which approach is best
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
    },
    setHighScore: (state, action) => {
      state.highScore = action.payload;
    },
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    setIsFlipped: (state, action) => {
      state.isFlipped = action.payload;
    },
    setIsGameOver: (state, action) => {
      state.isGameOver = action.payload;
    },
    // handleCardTheme: (state, action) => {
    //   state.cardTheme = action.payload;
    //   state.score = 0;
    //   dispatch(logToTextArea(`Card theme set: ${action.payload}`));
    //   if(state.isGameOver){
    //     newGame();
    //   }
    // },
    handleCardTheme: (state, action) => {
      state.cardTheme = action.payload;
      state.score = 0;
    },
    // handleCardClick: () => {},
    newGame: (state, action) => {
      // resetCardsClicked();
      state.score = 0;
      state.level = 1
      state.cardsList = shuffleArr(state.cardsList)
      state.isGameOver = false;
    },
    // nextLevel: () => {},
    // gameOver: () => {},
    // shuffleCardsThisLevel: () => {},

    resetCardsClicked: (state, action) => {
      state.cardsThisLevel = state.cardsThisLevel.map(c => ({...c, isClicked: false}));
      // Seems I dont need this, since everytime level or cardTheme changes, I am
      // running an Effect that takes a subset out of the initial cardsList, and
      // sets that as the cardsThisLevel. But cardsList has 'isClicked: false' 
      // and this never changes
    }
  },

  // extraReducers: (builder) => {
  //   builder.addCase(handleCardThemeThunk.pending, (state, action) => {
  //     state.cardTheme = action.payload;
  //     state.score = 0;
  //   });
  // },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type === 'game/setLevel' || action.type === 'game/setCardsList',
      (state, action) => {
        // Dispatch the thunk directly from extraReducers
        // action.asyncDispatch(myManualThunk());
        // action.asyncDispatch(effectSubstitute());
        console.log('EXTRA REDUCERRR SUBSITUTE EFFFECT ======')
      }
    );
  },
})

// Manual Thunks
// TODO rethink approach of entire file, but speciifcally below:
// There are some thunk that were just created ENTIRELY beacause I wanted to call dispatch(log),
// is there a simpler way so I can keep these functions inside of my createSlice redux above ?? middleware??

// OR BASICALLY, what is the easiest way to recycle code between RTK actions???
export const handleCardThemeGame = (cardTheme) => (dispatch, getState) => {
  dispatch(gameSlice.actions.handleCardTheme(cardTheme));
  dispatch(logToTextArea(`Card theme set: ${cardTheme}`));
  const state = getState().game;
  if (state.isGameOver) {
    dispatch(gameSlice.actions.newGame());
  }
};

export const nextLevel = (payload) => (dispatch, getState) => {
  console.log(' NEXT NEELELGLEVLLEV')
  const { level } = getState().game;
  dispatch(logToTextArea(`Level ${level + 1}`));
  dispatch(gameSlice.actions.setScore(0));
  dispatch(gameSlice.actions.setLevel(level + 1));
  // resetCardsClicked(); // dont need this bc pickCards useEffect() when level or cardTheme changes
};




// export const shuffleCardsThisLevel = createAsyncThunk(
//   'game/shuffleCardsThisLevel',
//   async (newCards, { dispatch, getState }) => {
export const shuffleCardsThisLevel = (newCards) => async (dispatch, getState) => {
  dispatch(gameSlice.actions.setIsFlipped(true));
  const { cardsThisLevel } = getState().game;
  if (cardsThisLevel.length !== 0){
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
  dispatch(gameSlice.actions.setCardsThisLevel(shuffleArr(newCards || cardsThisLevel)))
  
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  dispatch(gameSlice.actions.setIsFlipped(false))
}

export const gameOver = (character) => (dispatch, getState) => {
  dispatch(logToTextArea(`Game Over, Already Clicked ${character.name}`));
  dispatch(gameSlice.actions.setIsGameOver(true));
  const { cardsThisLevel } = getState().game;
  dispatch(gameSlice.actions.setCardsThisLevel(cardsThisLevel.map(c => {
    if(c.id === character.id){
      return ({...character, isDoubleClicked: true})
    }else {
      return c;
    }
  })));
  
};

export const handleCardClick = (card) => (dispatch, getState) => {
  const { score, highScore, cardsThisLevel } = getState().game;
  if(card.isClicked) { 
    dispatch(gameOver(card));
  }else {
    // sucessful selection
    dispatch(logToTextArea(`${card.name} selected`));
    dispatch(gameSlice.actions.setScore(score + 1));
    if (score + 1 > highScore){
      dispatch(gameSlice.actions.setHighScore(score + 1));
    }
    // setIsFlipped(true);

    if(score + 1 === cardsThisLevel.length){
      dispatch(nextLevel());
    } else {
      // continue on same level
      dispatch(gameSlice.actions.setCardsThisLevel(cardsThisLevel.map(c => {
        if(c.id === card.id){
          return ({...card, isClicked: true})
        }else {
          return c;
        }
      })))

      // NEW
      dispatch(shuffleCardsThisLevel());
    }
  }
};

export const effectSubstitute = (payload) => (dispatch, getState) => {
  // const { level, cardsList } = getState().game;
  // const numCards = 2 + 2 * level;
  // const subset = cardsList.slice(0, numCards);
  // dispatch(shuffleCardsThisLevel(subset));

  console.log('AJSHDJASHDKJASHDKJAHKSDJ')
};




// export const handleCardThemeThunk = createAsyncThunk(
//   'game/handleCardTheme',
//   async (payload, { dispatch, getState }) => {
//     dispatch(handleCardTheme(payload));
//     dispatch(logToTextArea(`Card theme set: ${payload}`));

//     const state = getState().game;
//     if (state.isGameOver) {
//       dispatch(newGame());
//     }

//     // Return the payload to set cardTheme
//     return payload;
//   }
// );


export const { cardsClickedSelect } = gameSlice.selectors;

export const { 
  setCardsThisLevel,
  setCardsList,
  setScore,
  setLevel,
  setIsFlipped,
  setIsGameOver,
  // handleCardClick,
  newGame,
  // nextLevel,
  // gameOver,
  // shuffleCardsThisLevel
} = gameSlice.actions;
export default gameSlice.reducer;