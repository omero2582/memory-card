import './App.css';
import Scoreboard from './components/Scoreboard';
import Board from './components/Board';
import Options from './components/Options';
import Advanced from './components/Advanced';
import championsRequest from './fetch/league';
import { useEffect, useState, useRef } from 'react';
import genshin from './fetch/genshin.js';
import playingCards from './fetch/playingCards';
import CardOptions from './components/CardOptions';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️
function App() {
  const [level, setLevel] = useState(1);
  const [cardsList, setCardsList] = useState([]);
  const [cardsClicked, setCardsClicked] = useState([]);
  const [cardsThisLevel, setCardsThisLevel] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [logs, setLogs] = useState([]);
  const textareaRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [cardTheme, setCardTheme] = useState('playingCards');
  const [showNames, setShowNames] = useState(false);
  const score = cardsClicked.length;
  const [bestScore, setBestScore] = useState(0);

  const logToTextArea = (message) => {
    setLogs(l => [...l, message]);
  };

  // Load cards when cardTheme changes
  useEffect(() => {
    const getGameCards = async () => {
      let cards;
      switch (cardTheme){
        case 'genshin':
          cards = await genshin();
          break;
        case 'league':
          cards = await championsRequest.processSummary();
          break;
        case 'playingCards':
        default:
          cards = await playingCards();
          break;
      }
      return cards;
    }

    const setupGame = async () => {
      const characterData = await getGameCards();
      const shuffled = shuffleArr(characterData);
      setCardsList(shuffled);
      setCardsClicked([]);
      await preloadImages(shuffled.map(c => c.img));
    }
    setIsLoading(true);
    setupGame();
    setIsLoading(false);
  }, [cardTheme]);

  // every level, choose champs out of the initially shuffled list
  useEffect(() => {
    const pickCards = () => {
      // Slice automatically uses array.length when you go over the limit. Dont have to worry about edge cases
      // only have to worry about the score and whether I want the Game to end
      const numCards = 2 + 2 * level;
      const subset = cardsList.slice(0, numCards);
      return subset;
    }
    setCardsThisLevel(pickCards());
  }, [level, cardsList])

  // every level
  useEffect(() => {
    logToTextArea(`Round ${level}`);
  }, [level])

  // anytime cardsClicked changes, shuffle the current visible cards
  useEffect(() => {
    setCardsThisLevel(c => shuffleArr(c));
    if (score > bestScore){
      setBestScore(score);
    }
  }, [cardsClicked, bestScore, score])

  const handleCardClick = (character) => {
    if(cardsClicked.some(char => char.id === character.id)) { 
      // Game Over
      logToTextArea(`Game Over, Already Clicked ${character.name}`);
      setLevel(1);
      setCardsClicked([]);
      setCardsList(c => shuffleArr(c));
    }else {
      // sucessful selection
      logToTextArea(`${character.name} selected`);
      if(cardsClicked.length + 1 === cardsThisLevel.length){
        setLevel(l => l + 1);
        setBestScore(s => s + 1);
        setCardsClicked([]); 
      } else {
        setCardsClicked(c => [...c, character]);
      }
    }
  };

  const handleCardTheme = (e) => {
    setCardTheme(e.target.value);
  }

  const handleShowNames = (e) => {
    setShowNames(e.target.checked);
  }

  return (
    <div className='container'>
      <main className='game'>
        <header>
         <h1 className='main-title'>Memory Card Game</h1>
          <p>Click on every Card once only, to get to the next level</p>
        </header>
        <CardOptions cardTheme={cardTheme} handleCardTheme={handleCardTheme} showNames={showNames} handleShowNames={handleShowNames}/>
        <Scoreboard level={level} numCards={cardsThisLevel.length} score={score} bestScore={bestScore}/>
        {cardsList.length === 0 ?
          (
            isLoading ? <h2>Loading...</h2>
            :<h2 className='error'>ERROR loading Cards</h2>
          )
        :<Board cards={cardsThisLevel} handleCardClick={handleCardClick} className={cardTheme} showNames={showNames}/>}
        <Options handleLevel={setLevel} handleShowAdvanced={setShowAdvanced} showAdvanced={showAdvanced}/>
        {showAdvanced && 
        <Advanced logs={logs} cardsClicked={cardsClicked} textareaRef={textareaRef}/>
        }
      
      </main>
      <footer className='Footer'>
        <p>Sebastian Cevallos</p>
      </footer>
    </div>
    //{JSON.stringify(cardsClicked, null, 2)}
  );
}

export default App;

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
