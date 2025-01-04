import React, {useState, useContext} from "react";
import Card from "../Card/Card";
import './Board.scss'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useThemeContext } from "../../context/ThemeContext";
import { GameContext } from "../../context/GameContext";
import { useSelector } from "react-redux";

export default function Board () {
  const { error, isLoading } = useContext(GameContext);
  const {cardsThisLevel: cards} = useSelector((state) => state.game);
  const {theme} = useThemeContext();
  let spinnerColors;
  if (theme === 'dark'){
    spinnerColors = {
      colorPrimary: '#fff',
      colorSecondary: 'rgba(255, 255, 255, 0.15)'
    }
  }
  
  if (error) return <h2 className='error'>ERROR loading Cards</h2>
  if (isLoading) return (
    <div className="Board-Loading">
      <LoadingSpinner width={50} showText {...spinnerColors}/>
    </div>
  )

  return (
    <section className="Board">
      <h2 className="visually-hidden">Gameboard</h2>
      {cards.map(character =>
        <Card 
          key={character.id}
          character={character}
          // showClickedCheat={showCardsClicked && character.isClicked}
        />)}
    </section>
  )
}