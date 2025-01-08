import genshin from './fetch/genshin';
import league from './fetch/league';
import playingCards from './fetch/playingCards';
import { useDispatch } from 'react-redux';
import { handleNewDeck, setCardTheme, setDeck } from '../store/slices/gameSlice';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCards = () => {
  const dispatch = useDispatch();
  
  const getGameCards = async (cardTheme) => {
    const themeMap = {
      genshin: genshin,
      league: league.processSummary,
      playingCards: playingCards
    };
  
    const fetchCards = themeMap[cardTheme] || playingCards;
    const out = await fetchCards();
    return out;
  };

  const setupGame = async (cardTheme) => {
    const cards = await getGameCards(cardTheme);
    // loading like this always starts out with isClicked: false. No need to call resetCardsClicked() here
    dispatch(setCardTheme(cardTheme))
    dispatch(handleNewDeck(cards))
    await preloadImages(cards.map(c => c.img));
    return cards;
  }

  const cardThemeQuery = useMutation({
    mutationFn: setupGame,
    onSuccess: async (cards, cardTheme) => {
      console.log('ON SUCCESSSSSS')
    }
  })

  return cardThemeQuery;
}

function preloadImages(imageUrls) {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    })
  );
}
  // old mapping solution instead of promises. would need to adjust code to fit this fn
  // const images = shuffled.map(char => {
  //   const img = new Image();
  //   img.src = char.img;
  //   return img;
  // });
  /* */
