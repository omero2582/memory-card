import { useEffect } from "react";
export default function Advanced({logs, championsClicked, textareaRef}) {

  useEffect(() => {
    if(textareaRef.current){
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logs, textareaRef])

  return (
    <section className="Advanced">
      <h2 className="visually-hidden">Advanced Options:</h2>
      <label htmlFor="logs"><h3>Logs</h3></label>
      <textarea ref={textareaRef} id="logs" className='logs' cols={50} rows={10} value={logs.join('\n')} readOnly />
      <h3>Champions Selected:</h3>
      {championsClicked.map(champ => <p key={champ.id}>{champ.name}</p>)}
    </section>
  )
}