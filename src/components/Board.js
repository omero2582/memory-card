import React from "react";
import Card from "./Card";

export default function Board ({champions, handleCardClick}) {
  return (
    <div className="board">
      {champions.map(champion => <Card key={champion.id} champion={champion} handleClick={handleCardClick}/>)}
    </div>
  )
}