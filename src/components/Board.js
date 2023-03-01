import React from "react";
import Card from "./Card";

export default function Board ({champions}) {
  return (
    <div className="board">
      {champions.map(champion => <Card key={champion.id} champion={champion}/>)}
    </div>
  )
}