import './GameOptions.css'
import Icon from '@mdi/react';
import { mdiCog } from '@mdi/js';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';
import { mdiSkipNext } from '@mdi/js';



export default function GameOptions ({ openModal, handleNextLevel}) {
  const {theme} = useContext(ThemeContext);
  
  return (
    <section className={`GameOptions ${theme}`}>
      <h2 className='visually-hidden'>Game Options</h2>
      <button onClick={openModal}>
        <Icon path={mdiCog} size={1.2} />
        Settings
      </button>
      <button onClick={handleNextLevel}>
        <Icon path={mdiSkipNext} size={1.2} />
        Next Level
      </button>
    </section>
  )
}