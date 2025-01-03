import './App.scss';
import Scoreboard from './components/Scoreboard/Scoreboard';
import Board from './components/Board/Board';
import GameOptions from './components/GameOptions/GameOptions';
import Advanced from './components/Advanced/Advanced';
import { useContext } from 'react';
import { GameContext } from './context/GameContext';
import { useThemeContext } from './context/ThemeContext';
import { useSelector } from 'react-redux';


function App() {
  const {theme} = useThemeContext();
  const {showAdvanced} = useSelector((state) => state.settings);
  const {isGameOver} = useContext(GameContext);
  
  return (
      <div className={`container ${theme}`}>
        <main className='game'>
          <header>
          < h1 className='main-title'>Card Memo</h1>
            <p>Click on every Card once only, to get to the next level</p>
          </header>
          <Scoreboard/>
          <Board/>
          <GameOptions/>
          {(isGameOver || showAdvanced) && 
          <Advanced/>
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