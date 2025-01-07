import genshin from './fetch/genshin';
import league from './fetch/league';
import playingCards from './fetch/playingCards';
import { useDispatch } from 'react-redux';
import { handleCardTheme, setDeck } from '../store/slices/gameSlice';
import { useMutation, useQuery } from '@tanstack/react-query';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);

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
    const characters = await getGameCards(cardTheme);
    // loading like this always starts out with isClicked: false. No need to call resetCardsClicked() here
    const shuffled = shuffleArr(characters);
    dispatch(setDeck(shuffled));
    dispatch(handleCardTheme(cardTheme))
    await preloadImages(shuffled.map(c => c.img));
    return characters;
  }

  const cardThemeQuery = useMutation({
    mutationFn: setupGame,
    onSuccess: async (characters, cardTheme) => {
      console.log('SUCCESSSSSS')
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
