import './App.css';
import Scoreboard from './components/Scoreboard';
import Board from './components/Board';
import GameOptions from './components/GameOptions';
import Advanced from './components/Advanced';
import championsRequest from './fetch/league';
import { useEffect, useState, useRef } from 'react';
import genshin from './fetch/genshin.js';
import playingCards from './fetch/playingCards';
import CardOptions from './components/CardOptions';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️
function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const [cardsList, setCardsList] = useState([]);
  const [cardsThisLevel, setCardsThisLevel] = useState([]);
  const [cardTheme, setCardTheme] = useState('playingCards');
  
  const [showNames, setShowNames] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCardsClicked, setShowCardsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const textareaRef = useRef();
  
  
  const logToTextArea = (message) => {
    setLogs(l => [...l, message]);
  };

  const resetCardsClicked = () => {
    setCardsThisLevel(cards => cards.map(c => ({...c, isClicked: false})));
  }

  const shuffleCardsThisLevel = () => {
    setCardsThisLevel(c => shuffleArr(c));
  }

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
      setIsLoading(true);
      logToTextArea(`Card theme set: ${cardTheme}`);
      const characterData = await getGameCards();
      // loading like this always starts out with isClicked: false. No need to call resetCardsClicked() here
      const shuffled = shuffleArr(characterData);
      setCardsList(shuffled);
      setScore(0);
      await preloadImages(shuffled.map(c => c.img));
      setIsLoading(false);
    }

    setupGame();
    
  }, [cardTheme]);
  
  // Effects
  // every level
  useEffect(() => {
    logToTextArea(`Round ${level}`);
  }, [level])

  // everytime level or cardsList changes, set cardsThisLevel
  useEffect(() => {
    const pickCards = () => {
      // Slice automatically uses array.length when you go over the limit
      const numCards = 2 + 2 * level;
      const subset = cardsList.slice(0, numCards);
      return subset;
    }
    setCardsThisLevel(pickCards());
  }, [level, cardsList])


  // Handlers
  const handleCardClick = (character) => {
    if(character.isClicked) { 
      // Game Over
      logToTextArea(`Game Over, Already Clicked ${character.name}`);
      resetCardsClicked();
      setScore(0);
      setLevel(1);
      setCardsList(c => shuffleArr(c));
    }else {
      // sucessful selection
      logToTextArea(`${character.name} selected`);
      setScore(s => s + 1);
      if (score + 1 > bestScore){
        setBestScore(score + 1);
      }

      if(score + 1 === cardsThisLevel.length){
        // next level
        resetCardsClicked();
        setLevel(l => l + 1);
        setScore(0);
      } else {
        // continue on same level
        setCardsThisLevel(cards => cards.map(c => {
          if(c.id === character.id){
            return ({...character, isClicked: true})
          }else {
            return c;
          }
        }))
      }
    }

    // Always suffle after every click
    shuffleCardsThisLevel();
  };

  const handleCardTheme = (e) => {
    setCardTheme(e.target.value);
  }

  const handleShowNames = (e) => {
    setShowNames(e.target.checked);
  }

  const handleShowAdvanced = () => {
    setShowAdvanced(s => !s);
    setShowCardsClicked(s => !s);
  }

  const handleNextLevel = () => {
    setLevel(l => l + 1)
  }

  return (
    <div className='container'>
      <main className='game'>
        <header>
         <h1 className='main-title'>Memory Card Game</h1>
          <p>Click on every Card once only, to get to the next level</p>
        </header>
        <CardOptions
          cardTheme={cardTheme}
          handleCardTheme={handleCardTheme}
          showNames={showNames}
          handleShowNames={handleShowNames}
        />
        <Scoreboard
          level={level}
          numCards={cardsThisLevel.length}
          score={score}
          bestScore={bestScore}
        />
        {cardsList.length === 0 ?
          (
            isLoading ? <h2>Loading...</h2>
            :<h2 className='error'>ERROR loading Cards</h2>
          )
        :<Board
          cards={cardsThisLevel}
          handleCardClick={handleCardClick}
          cardTheme={cardTheme}
          showNames={showNames}
          showCardsClicked={showCardsClicked}
          />}
        <GameOptions
          handleNextLevel={handleNextLevel}
          handleShowAdvanced={handleShowAdvanced}
          showAdvanced={showAdvanced}
        />
        {showAdvanced && 
        <Advanced logs={logs} cardsClicked={cardsThisLevel.filter(c => c.isClicked === true)} textareaRef={textareaRef}/>
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
