import React, {useState} from "react";
import Card from "../Card/Card";
import { useSettingsContext } from "../../context/SettingsContext";
import './Board.css'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useThemeContext } from "../../context/ThemeContext";

export default function Board ({ isGameOver, isFlipped, error, isLoading, cards, handleCardClick}) {
  // const {showCardsClicked} = useSettingsContext();
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
          isGameOver={isGameOver}
          isFlipped={isFlipped}
          key={character.id}
          character={character}
          onClick={handleCardClick}
          // showClickedCheat={showCardsClicked && character.isClicked}
        />)}
    </section>
  )
}