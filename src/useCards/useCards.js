import {useState, useEffect} from 'react'
import genshin from './fetch/genshin';
import league from './fetch/league';
import playingCards from './fetch/playingCards';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
export default function useCards(cardTheme) {
  const [cardsList, setCardsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGameCards = async () => {
      let cards;
      switch (cardTheme){
        case 'genshin':
          cards = await genshin();
          break;
        case 'league':
          cards = await league.processSummary();
          break;
        case 'playingCards':
        default:
          cards = await playingCards();
          break;
      }
      return cards;
    }

    const setupGame = async () => {
      setIsLoading(true);
      setError(null);
      const characters = await getGameCards();
      // loading like this always starts out with isClicked: false. No need to call resetCardsClicked() here
      const shuffled = shuffleArr(characters);
      setCardsList(shuffled);
      // logToTextArea(`Card theme set: ${cardTheme}`);
      // setScore(0);
      await preloadImages(shuffled.map(c => c.img));
      setIsLoading(false);
    }

    setupGame()
      .catch((error) => setError(error));
    
  }, [cardTheme]);

  return {isLoading, error, cardsList, setCardsList}
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
