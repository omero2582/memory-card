import React, { useMemo } from "react";
import './Card.scss'
import Icon from '@mdi/react';
import { mdiCardsSpade } from '@mdi/js';
import { mdiCardsClub } from '@mdi/js';
import { mdiCardsHeart } from '@mdi/js';
import { mdiCardsDiamond } from '@mdi/js';
import { useDispatch, useSelector } from "react-redux";
import { getCardBackURL } from "../../store/slices/settingsSlice";
import { handleCardClick } from "../../store/slices/gameSlice";

const playingCardsMap = {
  spades: mdiCardsSpade,
  clubs: mdiCardsClub,
  hearts: mdiCardsHeart,
  diamonds: mdiCardsDiamond,
}

const getShortName = (name, type) => {
  let shortName = name;
  if (type === 'playingCards') {
    if (!name.includes('joker')){
      const words = name.split(' ');
      const rank = words[0];
      const suit = words[words.length - 1];
      // console.log(suit, 'path= ',playingCardsMap[suit]);
      shortName = (
      <>
        <span>{rank}</span><Icon title={suit} path={playingCardsMap[suit]} size={1} />
      </>)
    }
  }
  return shortName;
}

export default function Card ({ character}) {
  const dispatch = useDispatch();
  const {name, id, img, type} = character;
  const { showNames, showCardsClicked, cardBack } = useSelector((state) => state.settings);
  const {cardTheme, isGameOver, isFlipped} = useSelector((state) => state.game);
  // console.log('NAAAAAME', name, 'CARD THEMEE', cardTheme)
  const showClickedCheat = character.isClicked && (showCardsClicked || isGameOver) ;
  
  let newName = useMemo(() => getShortName(name, type), [type, name]);
  
  const width = 140;
  const height = 200;
  const xStrokeWidth = 3;

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
            ${type}`}
          onClick={() => dispatch(handleCardClick(character))}>
          {showNames && <h3 className="card-name">{newName}</h3>}
          <img className={`card-img`} alt={name} src={img}/>
        </button>
        {/* {character.isDoubleClicked && <div className="x"></div>} */}
        {character.isDoubleClicked &&
        <svg className="svgX" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2={width} y2={height} stroke="black" strokeWidth={xStrokeWidth} />
          <line x1={width} y1="0" x2="0" y2={height} stroke="black" strokeWidth={xStrokeWidth} />
        </svg>}
        <div className="card-back">
          <img src={getCardBackURL(cardBack)} alt={`${cardBack} card-back`} />
        </div>
      </div>
    </div>
  )
}

