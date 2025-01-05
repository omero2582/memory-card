import { createListenerMiddleware } from '@reduxjs/toolkit';
import {  setLevel, nextLevel, setCardsList, handleCardTheme, gameOver, effectSubstitute, newGame} from './gameSlice';
import { logToTextArea } from './logsSlice';




const actionLogMap = {
  [nextLevel.type]: (action, originalState, state) =>  `Level ${originalState.level} -> ${state.level}`,
  [gameOver.type]: (action, originalState, state) =>  `Game Over, Already Clicked ${action.payload.name}`,
  [handleCardTheme.type]: (action, originalState, state) =>  `Card theme set: ${action.payload}`,
};

//

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


const shuffleMap = [setLevel.type, nextLevel.type, setCardsList.type, newGame.type]

export const shuffleMiddleware = createListenerMiddleware();
shuffleMiddleware.startListening({
  // matcher: (action) => shuffleMap.includes(action.type),
  predicate: (action, curState, prevState) =>
    prevState.game.level !== curState.game.level
    || prevState.game.cardsList !== curState.game.cardsList,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(effectSubstitute());
  },
});


// export const listenerMiddleware = createListenerMiddleware();
// // Generic listener that handles multiple actions
// listenerMiddleware.startListening({
//   matcher: (action) => action.type in actionLogMap,
//   effect: async (action, listenerApi) => {
//     const stateAfter = listenerApi.getState().game;
//     const stateBefore = listenerApi.getOriginalState().game;
    
//     const baseAction = action.payload?.type ? action.payload : action;
//     const logMessage = actionLogMap[baseAction.type](action, stateBefore, stateAfter);
//     listenerApi.dispatch(logToTextArea(logMessage));
//   },
// });

