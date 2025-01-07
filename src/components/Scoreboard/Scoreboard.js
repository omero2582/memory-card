import React from "react";
import './Scoreboard.scss'
import Icon from '@mdi/react';
import { mdiCardsPlaying } from '@mdi/js';
import { useSelector } from "react-redux";
import { cardsClickedSelect } from "../../store/slices/gameSlice";

export default function Scoreboard () {
  
  const {level, cardsOnBoard, score, highScore} = useSelector((state) => state.game);

  const cardsClicked = useSelector(cardsClickedSelect)
  const numCards = cardsOnBoard.length;
  const numClicked = cardsClicked.length;
  
  return (
    <section className="Scoreboard">
      <h2 className="visually-hidden">Scoreboard</h2>
      <div className="scores">
        <p className="stat">
          <span className="label">Score:</span>
          <span className="num">{score}</span></p>
        <p className="stat high-score">
          <span className="label">High Score:</span>
          <span className="num">{highScore}</span>
        </p>
      </div>
      <div>
        <p className="stat">
          <span className="label">Level</span>
          <span className="num">{level}</span>
        </p>
        <p className="stat">
          <span className="label numCards"><Icon title={'Cards'} path={mdiCardsPlaying} size={1.2} /></span>
          <span className="num">{`${numClicked}/${numCards}`}</span></p>
      </div>
    </section>
  )
}