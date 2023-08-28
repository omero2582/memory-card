import React, {useState} from "react";
import './Card.css'

export default function Card ({isFlipped, character, onClick, cardTheme, showNames, showClickedCheat}) {
  const {name, id, img} = character;
  
  const handleClick = () => {
    // setIsFlipped(true);
    // console.log('CLICK');
    // setTimeout(() => {
    //   setIsFlipped(false)
    // },1250)
    onClick(character);
    // need to add this somewhere^^
  };
  return (
    <div className={`card ${isFlipped ? 'flipped' : ''}`}>
      <div className="card-inner">
        <button disabled={isFlipped} className={`Card card-front ${showClickedCheat ? 'showClickedCheat' : '' }`} onClick={handleClick}>
          {showNames && <h3 className="card-name">{name}</h3>}
          <img className={`card-img ${cardTheme}`} alt={name} src={img}/>
        </button>
        <div className="card-back">
          <img src={process.env.PUBLIC_URL + '/CardBacks/yugioh.png'} alt="Back of the card" />
        </div>
      </div>
    </div>
  )
}

