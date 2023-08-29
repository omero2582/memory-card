import React from "react";
import './Scoreboard.css'

export default function Scoreboard ({level, numCards, score, bestScore}) {
  return (
    <section className="Scoreboard">
      <h2 className="visually-hidden">Scoreboard</h2>
      <div className="scores">
        <p className="h2">Score: {score}</p>
        <p className="h2">Best Score: {bestScore}</p>
      </div>
      <div>
        <p className="h2">Level: {level}</p>
        <p className="h2">Cards: {numCards}</p>
      </div>
    </section>
  )
}