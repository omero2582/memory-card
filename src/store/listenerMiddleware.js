import { createListenerMiddleware } from '@reduxjs/toolkit';
import {   nextLevel, setDeck, setCardTheme , gameOver, drawCards, newGame} from './slices/gameSlice';
import { logToTextArea } from './slices/logsSlice';




const actionLogMap = {
  [nextLevel.type]: (action, originalState, state) =>  `Level ${originalState.level} -> ${state.level}`,
  [gameOver.type]: (action, originalState, state) =>  `Game Over, Already Clicked ${action.payload.name}`,
  [setCardTheme.type]: (action, originalState, state) =>  `Card theme set: ${action.payload}`,
};

//

// Captures state before vs after with actions.
// But when using sync thunks, it can only capture before states
// It seems like for async thunks, I have to specifically map above to their /fufilled, and /pending actions,
// but it seems like I cannot capture the before and after states to hold these variables in 1 single scope
export const stateCaptureMiddleware = (store) => (next) => (action) => {
  const stateBefore = store.getState().game;
  const result = next(action);  // Let the reducer handle the action
  const stateAfter = store.getState().game;

  // console.log('TYEPEEEE', action.type)
  if (action.type in actionLogMap) {
    const logMessage = actionLogMap[action.type](action, stateBefore, stateAfter);
    store.dispatch(logToTextArea(logMessage));
  }
  
  return result;
};
//

const shuffleMap = [ nextLevel.type, setDeck.type, newGame.type]

// Listener middleware below is basically a simpler way to write middleware above, but will only run after an action/state,
// so you cannot sandwitch an action/state with 2 functions
export const gameMiddleware = createListenerMiddleware();


// Shuffling Effect
gameMiddleware.startListening({
  // matcher: (action) => shuffleMap.includes(action.type),
  // predicate is able to trigger when specific state changes, as oppossed to relying on matcher for action triggers
  // predicate is better because I only have to list 2 states, as opposed to listing 4 actions that change those 2 states
  predicate: (action, curState, prevState) =>
    prevState.game.level !== curState.game.level
    // || prevState.game.deck !== curState.game.deck
    || action.type === newGame.type
  ,effect: async (action, listenerApi) => {
    listenerApi.dispatch(drawCards());
  },
});

// Logging effect
// gameMiddleware.startListening({
//   matcher: (action) => action.type in actionLogMap,
//   effect: async (action, listenerApi) => {
//     const stateBefore = listenerApi.getOriginalState().game;
//     const stateAfter = listenerApi.getState().game;
    
//     const baseAction = action.payload?.type ? action.payload : action;
//     const logMessage = actionLogMap[baseAction.type](action, stateBefore, stateAfter);
//     listenerApi.dispatch(logToTextArea(logMessage));
//   },
// });

