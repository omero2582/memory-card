import React from "react";
import Card from "./Card";

export default function Board ({cards, handleCardClick, className, showNames}) {
  return (
    <section className="Board">
      <h2 className="visually-hidden">Gameboard</h2>
      {cards.map(character => <Card key={character.id} character={character} onClick={handleCardClick} className={className} showNames={showNames}/>)}
    </section>
  )
}