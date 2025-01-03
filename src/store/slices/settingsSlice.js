import { createSlice } from "@reduxjs/toolkit";

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


const initialState = {
  showNames: false,
  showAdvanced: false,
  showCardsClicked: false,
  cardBack: loadCardBack(),
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    handleShowNames: (state, action) => {
      state.showNames = action.payload;
    },
  
    toggleShowAdvanced: (state, action) => {
      state.showAdvanced = !state.showAdvanced;
      state.showCardsClicked = !state.showCardsClicked;
    },
  
    handleShowAdvanced: (state, action) => {
      state.showAdvanced = action.payload || true;
      state.showCardsClicked = action.payload || true;
    },
  
    handleCardBack: (state, action) => {
      state.cardBack = action.payload;
      localStorage.setItem('cardBack', action.payload)
    },

    handleShowCardsClicked: (state, action) => {
      state.showCardsClicked = action.payload || true;
    },

  }
})

export const { handleCardBack, handleShowAdvanced, handleShowCardsClicked, handleShowNames, toggleShowAdvanced } = settingsSlice.actions;
export { getCardBackURL, cardBackMap };
export default settingsSlice.reducer;