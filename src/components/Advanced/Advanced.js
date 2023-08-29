import { useEffect } from "react";
import './Advanced.css'
export default function Advanced({logs, cardsClicked, textareaRef}) {

  useEffect(() => {
    if(textareaRef.current){
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs, textareaRef])

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