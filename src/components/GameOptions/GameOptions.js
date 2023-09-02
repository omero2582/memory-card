import './GameOptions.css'
import Icon from '@mdi/react';
import { mdiCog } from '@mdi/js';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';
import { mdiSkipNext } from '@mdi/js';
import { useState, useRef } from 'react';
import SettingsModal from '../SettingsModal/SettingsModal';
import { mdiPlus } from '@mdi/js';



export default function GameOptions ({ handleNextLevel, handleNewGame, isGameOver }) {
  const {theme} = useContext(ThemeContext);
  const modalRef = useRef(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  
  const openModal = () => {
    setIsModalClosing(false);
    modalRef.current.showModal();
  };

  const closeModal = () => {
    // modalRef.current.addEventListener("transitionend", handleTransitionEnd);
    modalRef.current.addEventListener("animationend", handleTransitionEnd);
    setIsModalClosing(true);
  };

  const handleTransitionEnd = () => {
    console.log('end transition')
    modalRef.current.removeEventListener("animationend", handleTransitionEnd);
    modalRef.current.close();
  }
  return (
    <>
      <SettingsModal ref={modalRef} closeModal={closeModal} isModalClosing={isModalClosing} isGameOver={isGameOver}  newGame={handleNewGame}/>
      <section className={`GameOptions ${theme}`}>
        <h2 className='visually-hidden'>Game Options</h2>
        <button onClick={openModal}>
          <Icon path={mdiCog} size={1.2} />
          Settings
        </button>
        { !isGameOver &&
        <button onClick={handleNextLevel}>
          <Icon path={mdiSkipNext} size={1.2} />
          Next Level
        </button>
        }
        { isGameOver &&
        <button onClick={handleNewGame} className='new-game'>
        <Icon path={mdiPlus} size={1.2} />
          New Game
        </button>
        }
      </section>
    </>
    
  )
}