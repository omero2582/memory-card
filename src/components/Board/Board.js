import React, {useState, useContext, useEffect} from "react";
import Card from "../Card/Card";
import './Board.scss'
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useThemeContext } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import { useCards } from "../../useCards/useCards";
import { useGetCardsQuery } from "../../store/api/apiSlice";

export default function Board () {
  const { cardTheme } = useSelector((state) => state.game);
  const cardMutation = useCards();
  // const {error, isPending, isSuccess} = cardMutation;
  const {cardsOnBoard: cards} = useSelector((state) => state.game);
  const {theme} = useThemeContext();
  let spinnerColors;
  if (theme === 'dark'){
    spinnerColors = {
      colorPrimary: '#fff',
      colorSecondary: 'rgba(255, 255, 255, 0.15)'
    }
  }

  // useEffect(() => {
  //   cardMutation.mutate(cardTheme)
  // }, [])

   const {isSuccess, error, isLoading, isFetching} = useGetCardsQuery(cardTheme)
   // TODO solve... currently we are not taking advantage of the caching.....
   // because in SettingsModal.js, everytime we call trigger(), it will always trigger a refetch no matter what

   // Figure out how to solve this...
   // so far I have found 3 solutions, all kinda bad
   // 1. instead of calling trigger(), call a wrapper function that checks it useGetDataQuery({disabled}).currentData,
   // then only calls trigger() if (currentData && !isFetching)
   // 2. take the L, and react to redux store chanign its 'cardTheme'
   // 3. keep trakc of the time yourself... (lol)

   // TBH things still feel 'off', because even after switching to RTK Query, seems like there are some underlying issues
   // for ex, I should be making use of the cached data as a source for SOMETHING perhaps ???
   // I mean I feel like it can be the source of deck ??? but idk, maybe we call it deckList, and make use of it somehow??

   // Also, after loading the cards in my Query, I am afterwards always doing a bunch of dispatches, and I feel like
   // maybe this shouldnt be in the query itself but rather disconected? not sure.

   // TODO TOOD 
   // highet priority for now, is just = find a way to not spam fetch calls, AKA make use of our RTK Query caching !!!
  
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