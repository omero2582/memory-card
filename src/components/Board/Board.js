import React, {useState, useContext, useEffect} from "react";
import Card from "../Card/Card";
import './Board.scss'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useThemeContext } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import { useCards } from "../../useCards/useCards";

export default function Board () {
  const { cardTheme } = useSelector((state) => state.game);
  const cardMutation = useCards();
  const {error, isPending, isSuccess} = cardMutation;
  const {cardsOnBoard: cards} = useSelector((state) => state.game);
  const {theme} = useThemeContext();
  let spinnerColors;
  if (theme === 'dark'){
    spinnerColors = {
      colorPrimary: '#fff',
      colorSecondary: 'rgba(255, 255, 255, 0.15)'
    }
  }

  useEffect(() => {
    cardMutation.mutate(cardTheme)
  }, [])
  
  if (error) return <h2 className='error'>ERROR loading Cards</h2>
  if (!isSuccess) return (
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