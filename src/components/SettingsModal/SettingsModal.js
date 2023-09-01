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
    
  const {isModalClosing, closeModal} = props;
  



  return (
    <dialog ref={ref} className={`SettingsModal ${isModalClosing ? 'closing' : '' }`} onClick={closeModal}>
      <section className={`Settings ${theme}`} onClick={e => e.stopPropagation()}>
        <section className="game-theme">
          <label htmlFor="game-theme" className="game-theme-title">Card Theme:</label>
          <select 
            id="game-theme" 
            value={cardTheme || 'league'}  // sets league as default, without changing the url
            onChange={handleCardTheme}>
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