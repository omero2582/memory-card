import './App.css';
import Scoreboard from './components/Scoreboard/Scoreboard';
import Board from './components/Board/Board';
import GameOptions from './components/GameOptions/GameOptions';
import Advanced from './components/Advanced/Advanced';
import { useEffect, useState, useRef } from 'react';
import useCards from './useCards/useCards';
import { ThemeContext } from './context/ThemeContext';
import { flushSync } from 'react-dom';
import SettingsModal from './components/SettingsModal/SettingsModal';
import { useSettingsContext } from './context/SettingsContext';
import { useContext } from 'react';
import { LogContext } from './context/LogContext';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);
// TODO TODO in case i need these symbols ♠️♥️♦️♣️
function App() {
  
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [cardsThisLevel, setCardsThisLevel] = useState([]);

  const {logs, logToTextArea} = useContext(LogContext);
  const {theme} = useContext(ThemeContext);
  const {cardTheme, showAdvanced} = useSettingsContext();

  const [isFlipped, setIsFlipped] = useState(false);


  const resetCardsClicked = () => {
    setCardsThisLevel(cards => cards.map(c => ({...c, isClicked: false})));
    // Seems I dont need this, since everytime level or cardTheme changes, I am
    // running an Effect that takes a subset out of the initial cardsList, and
    // sets that as the cardsThisLevel. But cardsList has 'isClicked: false' 
    // and this never changes
    // TODO this is mostly right reasoning, but TODO figure out why I use
    // setCardsList in my code below when "Game Over"
    // I know why I do it, but I think the reason I still done need to run 
    // resetsCardsClicked() there is because I am also changing the level
    // on game over, which re-runs the effect to pick cards.
    // And again, the effect to pick cards always takes the cards out of the
    // original cardsList whose values of 'isClicked: false' never change
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
  },[cardTheme, logToTextArea]);
  
  // // every level
  // useEffect(() => {
  //   logToTextArea(`Level ${level}`);
  // }, [level, logToTextArea])

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




  // Handlers
  const nextLevel = () => {
    logToTextArea(`Level ${level + 1}`);
    setLevel(l => l + 1);
    setScore(0);
    // resetCardsClicked(); // dont need this bc pickCards useEffect() when level or cardTheme changes
  }

  const gameOver = (character) => {
    logToTextArea(`Game Over, Already Clicked ${character.name}`);
    // resetCardsClicked();
    setScore(0);
    setLevel(1);
    setCardsList(c => shuffleArr(c));
  }

  const handleCardClick = async (character) => {
    if(character.isClicked) { 
      gameOver(character);
    }else {
      // sucessful selection
      logToTextArea(`${character.name} selected`);
      setScore(s => s + 1);
      if (score + 1 > bestScore){
        setBestScore(score + 1);
      }
      // setIsFlipped(true);

      if(score + 1 === cardsThisLevel.length){
        nextLevel();
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



  return (
      <div className={`container ${theme}`}>
        <main className='game'>
          <header>
          < h1 className='main-title'>Memory Card Game</h1>
            <p>Click on every Card once only, to get to the next level</p>
          </header>
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
            isFlipped={isFlipped}
            cardTheme={cardTheme}
          />
          <GameOptions handleNextLevel={nextLevel}/>
          {showAdvanced && 
          <Advanced cardsClicked={cardsThisLevel.filter(c => c.isClicked === true)}/>
          }
        
        </main>
        <footer className={`Footer ${theme}`}>
          <p>Sebastian Cevallos</p>
        </footer>
      </div>
    //{JSON.stringify(cardsClicked, null, 2)}
  );
}

export default App;