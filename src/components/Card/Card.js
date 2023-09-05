import React, {useState} from "react";
import './Card.css'
import Icon from '@mdi/react';
import { mdiCardsSpade } from '@mdi/js';
import { mdiCardsClub } from '@mdi/js';
import { mdiCardsHeart } from '@mdi/js';
import { mdiCardsDiamond } from '@mdi/js';
import { useSettingsContext } from "../../context/SettingsContext";

const playingCardsMap = {
  spades: mdiCardsSpade,
  clubs: mdiCardsClub,
  hearts: mdiCardsHeart,
  diamonds: mdiCardsDiamond,

}

export default function Card ({isGameOver, isFlipped, character, onClick}) {
  const {name, id, img} = character;
  const { cardTheme, showNames, showCardsClicked, cardBack, getCardBackURL } = useSettingsContext();
  const showClickedCheat = showCardsClicked && character.isClicked;
  
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
  const width = 140;
  const height = 200;
  const strokeWidth = 3;

  return (
    <div className={`card ${isFlipped ? 'flipped' : ''}` }>
      <div className="card-inner">
        <button 
          title={name} 
          disabled={isFlipped || isGameOver} 
          className={
            `card-front
            ${showClickedCheat ? 'showClickedCheat' : '' }
            ${isGameOver ? 'game-over' : ''}
            ${character.isDoubleClicked ? 'double-clicked' : ''}
            ${cardTheme}`}
          onClick={handleClick}>
          {showNames && <h3 className="card-name">{newName}</h3>}
          <img className={`card-img`} alt={name} src={img}/>
        </button>
        {/* {character.isDoubleClicked && <div className="x"></div>} */}
        {character.isDoubleClicked &&
        <svg className="svgX" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2={width} y2={height} stroke="black" stroke-width={strokeWidth} />
          <line x1={width} y1="0" x2="0" y2={height} stroke="black" stroke-width={strokeWidth} />
        </svg>}
        <div className="card-back">
          <img src={getCardBackURL(cardBack)} alt={`${cardBack} card-back`} />
        </div>
      </div>
    </div>
  )
}

