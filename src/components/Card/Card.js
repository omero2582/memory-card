import React, {useState} from "react";
import './Card.css'
import Icon from '@mdi/react';
import { mdiCardsSpade } from '@mdi/js';
import { mdiCardsClub } from '@mdi/js';
import { mdiCardsHeart } from '@mdi/js';
import { mdiCardsDiamond } from '@mdi/js';

const playingCardsMap = {
  spades: mdiCardsSpade,
  clubs: mdiCardsClub,
  hearts: mdiCardsHeart,
  diamonds: mdiCardsDiamond,

}

export default function Card ({isFlipped, character, onClick, cardTheme, showNames, showClickedCheat}) {
  const {name, id, img} = character;
  let newName = name;

  

  if (cardTheme === 'playingCards') {
    if (!name.includes('joker')){
      const words = name.split(' ');
      const rank = words[0];
      const suit = words[words.length - 1];
      console.log(playingCardsMap[suit]);
      console.log(suit);
      newName = (<>
      <span>{rank}</span><Icon title={suit} path={playingCardsMap[suit]} size={1} />
      </>)
    }
  }
  
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
        <button title={name} disabled={isFlipped} className={`card-front ${showClickedCheat ? 'showClickedCheat' : '' }`} onClick={handleClick}>
          {showNames && <h3 className="card-name">{newName}</h3>}
          <img className={`card-img ${cardTheme}`} alt={name} src={img}/>
        </button>
        <div className="card-back">
          <img src={process.env.PUBLIC_URL + '/CardBacks/yugioh.png'} alt="Back of the card" />
        </div>
      </div>
    </div>
  )
}

