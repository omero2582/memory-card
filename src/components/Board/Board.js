import React, {useState, useContext, useEffect} from "react";
import Card from "../Card/Card";
import './Board.scss'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useThemeContext } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useGetDeckListQuery } from "../../store/api/apiSlice";
import { handleNewDeck } from "../../store/slices/gameSlice";

export default function Board () {
  const { cardsOnBoard, cardTheme } = useSelector((state) => state.game);
  const { theme } = useThemeContext();
  let spinnerColors;
  if (theme === 'dark'){
    spinnerColors = {
      colorPrimary: '#fff',
      colorSecondary: 'rgba(255, 255, 255, 0.15)'
    }
  }

  const {data: deckList, isSuccess, error, isLoading, isFetching} = useGetDeckListQuery(cardTheme)

  const dispatch = useDispatch();

  useEffect(() => {
    const setupGame  = async() => {
      dispatch(handleNewDeck(deckList))
    }
    if(deckList){
      setupGame()
      console.log('EFFECT')
    }
  }, [deckList])

  
  if (error) return <h2 className='error'>ERROR loading Cards</h2>
  if (!isSuccess) return (
    <div className="Board-Loading">
      <LoadingSpinner width={50} showText {...spinnerColors}/>
    </div>
  )

  return (
    <section className="Board">
      <h2 className="visually-hidden">Gameboard</h2>
      {cardsOnBoard.map(character =>
        <Card 
          key={character.id}
          character={character}
        />)}
    </section>
  )
}