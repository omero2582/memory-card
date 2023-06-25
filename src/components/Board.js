import React from "react";
import Card from "./Card";

export default function Board ({champions, handleCardClick}) {
  return (
    <section className="board">
      <h2 className="visually-hidden">Gameboard</h2>
      {champions.map(champion => <Card key={champion.id} champion={champion} handleClick={handleCardClick}/>)}
    </section>
  )
}