import React, {useState} from "react";
import './styles/Card.css'

export default function Card ({character, onClick, cardTheme, showNames, showClickedCheat}) {
  const {name, id, img} = character;
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    // css click class effect
    setClicked(true);
    onClick(character);
    setTimeout(() => {
      setClicked(false)
    }, 250)
  }
  return (
    <button className={`Card ${clicked ? 'clicked' : '' } ${showClickedCheat ? 'showClickedCheat' : '' }`} onClick={handleClick}>
      {showNames && <h3 className="card-name">{name}</h3>}
      <img className={`card-img ${cardTheme}`} alt={name} src={img}/>
    </button>
  )
}