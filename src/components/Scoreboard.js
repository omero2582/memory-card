import React from "react";

export default function Scoreboard ({level, numChamps}) {
  return (
    <section className="Scoreboard">
      <h2 className="visually-hidden">Scoreboard</h2>
      <p className="h2">Level: {level}</p>
      <p className="h2">Champions: {numChamps}</p>
    </section>
  )
}