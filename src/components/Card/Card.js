import React, {useState} from "react";
import './Card.css'

export default function Card ({character, onClick, cardTheme, showNames, showClickedCheat}) {
  const {name, id, img} = character;
  const [clickAnimate, setClickAnimate] = useState(false);
  const handleClick = () => {
    // css click class effect
    setClickAnimate(true);
    onClick(character);
    setTimeout(() => {
      setClickAnimate(false)
    }, 250)
  }
  return (
    <button className={`Card ${clickAnimate ? 'click-animate' : '' } ${showClickedCheat ? 'showClickedCheat' : '' }`} onClick={handleClick}>
      {showNames && <h3 className="card-name">{name}</h3>}
      <img className={`card-img ${cardTheme}`} alt={name} src={img}/>
    </button>
  )
}