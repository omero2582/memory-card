import React from "react";
import Card from "./Card";

export default function Board ({error, isLoading, cards, showCardsClicked, handleCardClick, cardTheme, showNames}) {
  
  if (error) return <h2 className='error'>ERROR loading Cards</h2>
  if (isLoading) return <h2>Loading...</h2>

  return (
    <section className="Board">
      <h2 className="visually-hidden">Gameboard</h2>
      {cards.map(character =>
        <Card 
          key={character.id}
          character={character}
          onClick={handleCardClick}
          cardTheme={cardTheme}
          showNames={showNames}
          showClickedCheat={showCardsClicked && character.isClicked}
        />)}
    </section>
  )
}