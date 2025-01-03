import { useEffect, useRef } from "react";
import './Advanced.scss'
import { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { useSelector } from "react-redux";
export default function Advanced() {
  const { logs } = useSelector((state) => state.logs);
  const textareaRef = useRef();
  const {cardsClicked} = useContext(GameContext);
  
  useEffect(() => {
    if(textareaRef.current){
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs])

  return (
    <section className="Advanced">
      <h2 className="visually-hidden">Advanced Options:</h2>
      <label htmlFor="logs"><h3>Logs</h3></label>
      <textarea ref={textareaRef} id="logs" className='logs'  value={logs.join('\n')} readOnly />
      <h3>Cards Selected:</h3>
      {cardsClicked.map(char => <p key={char.id}>{char.name}</p>)}
    </section>
  )
}