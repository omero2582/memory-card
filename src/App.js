import './App.css';
import Scoreboard from './components/Scoreboard/Scoreboard';
import Board from './components/Board/Board';
import GameOptions from './components/GameOptions/GameOptions';
import Advanced from './components/Advanced/Advanced';
import { useEffect, useState, useRef } from 'react';
import CardOptions from './components/CardOptions/CardOptions';
import useCards from './useCards/useCards';
import { ThemeContext } from './context/ThemeContext';
import { flushSync } from 'react-dom';
import SettingsModal from './components/SettingsModal/SettingsModal';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️
function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const [cardsThisLevel, setCardsThisLevel] = useState([]);
  const [cardTheme, setCardTheme] = useState('playingCards');
  
  const [showNames, setShowNames] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCardsClicked, setShowCardsClicked] = useState(false);

  const [logs, setLogs] = useState([]);
  const textareaRef = useRef();

  const [isFlipped, setIsFlipped] = useState(false);
  
  
  const logToTextArea = (message) => {
    setLogs(l => [...l, message]);
  }

  const resetCardsClicked = () => {
    setCardsThisLevel(cards => cards.map(c => ({...c, isClicked: false})));
  }

  const shuffleCardsThisLevel = async (newCards) => {
    // ORIGINAL setCardsThisLevel(c => shuffleArr(c));

    setIsFlipped(true);
    if (cardsThisLevel.length !== 0){
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    setCardsThisLevel(c => shuffleArr(newCards || c));
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsFlipped(false);
  }

  // Load cards when cardTheme changes
  const {cardsList, setCardsList, isLoading, error } = useCards(cardTheme);

  // Effects
  // card theme change
  useEffect(() => {
    logToTextArea(`Card theme set: ${cardTheme}`);
    setScore(0);
  },[cardTheme]);
  
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
    // setCardsThisLevel(pickCards());
    // NEW
    shuffleCardsThisLevel(pickCards());
    // Problem here... shuffle cards calls its own 'setCardsThisLevel', which is racing with
    // the setCardsThisLevel right on top of this statement
  }, [level, cardsList])

  //sync theme change to local storage & text Logs
  useEffect(() => {
    localStorage.setItem('theme', theme)
    logToTextArea(`Color theme set to: ${theme}`);
  }, [theme])


  // Handlers
  const handleCardClick = async (character) => {
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
      // setIsFlipped(true);

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

        // NEW
        shuffleCardsThisLevel();
      }
    }

    // Always suffle after every clicl
    // shuffleCardsThisLevel();
    // TODO TODO
    // this line creates race condition problems with the card flipping animation state
    // i think this state triggers a useEffect()... have to think about how to solve this.
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
    setLevel(l => l + 1);
    setScore(0);
  }

  const toggleTheme = () => {
    setTheme(t => (t === 'light') ? 'dark' : 'light')
  }


  const modalRef = useRef(null);
  
  const openModal = () => {
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.close()
  };



  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div className={`container ${theme}`}>
        <main className='game'>
          <header>
          < h1 className='main-title'>Memory Card Game</h1>
            <p>Click on every Card once only, to get to the next level</p>
          </header>
          <SettingsModal
            ref={modalRef}
            closeModal={closeModal}
            cardTheme={cardTheme}
            handleCardTheme={handleCardTheme}
            showNames={showNames}
            handleShowNames={handleShowNames}
            showAdvanced={showAdvanced}
            handleShowAdvanced={handleShowAdvanced}
          />
          {/* <CardOptions
            cardTheme={cardTheme}
            handleCardTheme={handleCardTheme}
            showNames={showNames}
            handleShowNames={handleShowNames}
          /> */}
          <Scoreboard
            level={level}
            numCards={cardsThisLevel.length}
            score={score}
            bestScore={bestScore}
          />
          <Board
            error={error}
            isLoading={isLoading}
            cards={cardsThisLevel}
            handleCardClick={handleCardClick}
            cardTheme={cardTheme}
            showNames={showNames}
            showCardsClicked={showCardsClicked}
            isFlipped={isFlipped}
            />
          <GameOptions
            handleNextLevel={handleNextLevel}
            handleShowAdvanced={handleShowAdvanced}
            showAdvanced={showAdvanced}
            openModal={openModal}
          />
          
          {/* <button onClick={openModal}>Settings</button> */}
          {showAdvanced && 
          <Advanced logs={logs} cardsClicked={cardsThisLevel.filter(c => c.isClicked === true)} textareaRef={textareaRef}/>
          }
        
        </main>
        <footer className={`Footer ${theme}`}>
          <p>Sebastian Cevallos</p>
        </footer>
      </div>
    </ThemeContext.Provider>
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
