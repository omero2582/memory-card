import React, { useContext, forwardRef } from 'react'
import './SettingsModal.css'
import Switch from "react-switch";
import { ThemeContext } from '../../context/ThemeContext';
import { useSettingsContext } from '../../context/SettingsContext';

const SettingsModal = forwardRef(function SettingsModal(props, ref) {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const {
    cardTheme, handleCardTheme,
    showNames, handleShowNames,
    showAdvanced, toggleShowAdvanced} = useSettingsContext();
    
  const {isModalClosing, closeModal, isGameOver, newGame} = props;
  
  // TODO TODO. read comment below in JSX. I added this handler below as a quick band-aid fix.
  // Right now, I am prop drilling isGameOver and newGame()
  // I need to change this by putting all the game logic into its separate context, so that I dont have to drill them 
  // into here like this, and handleCardTheme can just have access to isGameOver and newGame from a context.
  // I also prop drilled isGameOver in some other place too.
  // Can maybe also just bootleg move the SettingsProvider INSIDE of App.js instead of outside, then pass it isGameOver
  // and newGame(). That would solve this problem, and maybe other places where they were prop drilled??
  // not sure. Really have to look and think about whether its better to have global context access to the game vars and handlers
  const onChange = (e) => {
    handleCardTheme(e);
    if(isGameOver){
      newGame();
    }
  }



  return (
    <dialog ref={ref} className={`SettingsModal ${isModalClosing ? 'closing' : '' }`} onClick={closeModal}>
      <section className={`Settings ${theme}`} onClick={e => e.stopPropagation()}>
        <section className="game-theme">
          <label htmlFor="game-theme" className="game-theme-title">Card Theme:</label>
          <select 
            id="game-theme" 
            value={cardTheme || 'league'}  // sets league as default, without changing the url
            onChange={onChange}  //was handleCardTheme
            // TODO add if(GameOver) => newGame. I can put it on the effect itself inside App.js but that feels wrong & missuse of useEffect
            // yea... and the handler is in themeContext.. this makes me think that ther should be a GameContext wrapped around Settings,
            // AT LEAST containing 'isGameOver' and 'newGame()'. but bc of the vriables these handle, prob ALL the gamestate would go on this context,
            // besides things to go with rendering or display logic. <- that would stay inside App.js which would be renaemd to <GameView>
          > 
            <option value='playingCards'>Playing Cards</option>
            <option value='league'>League of Legends</option>
            <option value='genshin'>Genshin Impact</option>
          </select>
        </section>
        <section>
          <label htmlFor='toggle-theme'>Dark Theme</label>
          <Switch
            id='toggle-theme'
            className='toggle-theme'
            onChange={toggleTheme}
            checked={(theme === 'dark')}
            uncheckedIcon={false}
            offColor='#F7F9F9'
            offHandleColor='#000'
            height={20}
            width={46}
          />
        </section>
        <section className="show-names">
          <label htmlFor="show-names">Show Names</label>
          <input id="show-names" type="checkbox" checked={showNames} onChange={handleShowNames}></input>
        </section>
        <section>
        <label htmlFor="show-advanced">Show Advanced</label>
          <input id="show-advanced" type="checkbox" checked={showAdvanced} onChange={toggleShowAdvanced}></input>
        </section>
        <button className='close' onClick={closeModal}>Close</button>
      </section>
    </dialog>
  );
})

export default SettingsModal;