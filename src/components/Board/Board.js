import React, {useState, useContext} from "react";
import Card from "../Card/Card";
import { useSettingsContext } from "../../context/SettingsContext";
import './Board.css'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useThemeContext } from "../../context/ThemeContext";
import { GameContext } from "../../context/GameContext";

export default function Board () {
  // const {showCardsClicked} = useSettingsContext();
  const { error, isLoading, cardsThisLevel: cards} = useContext(GameContext);
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