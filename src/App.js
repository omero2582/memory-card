import './App.css';
import Score from './components/Score';
import Board from './components/Board';
import { useEffect, useState } from 'react';
import championData from './championData';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';


function App() {
  const [level, setLevel] = useState(1);
  const [championsList, setChampionsList] = useState([]);
  // const [filteredChampionsList, setFilteredChampionsList] = useState([]); unnecessary ?? isnce it can be calculated using existing stuff
  let filteredChampionsList = [];
  
  const pickRandomChamps = () => {
    // level 1 starts at 4 champs. progressive levels add another 2 champs to the list.
    // TODO TODO. How do I handle the edge case where I add the max number of champs ?
    // Also, what happens in the edge case where I try to add 2 more champs, but there is only 1 last champ remaining to add ?
    const numChamps = 2 + 2 * level;

    const shuffled = [...championsList].sort(() => Math.random() - 0.5);
    const randomSubset = shuffled.slice(0, numChamps);
    //setFilteredChampionsList(randomSubset);
    return randomSubset;
  }

  filteredChampionsList = pickRandomChamps();

  useEffect(() => {
    const fetchData = async () => {
      const championsArr = await championData.processSummary();
      setChampionsList([championsArr]);
      console.log(championsArr);
    }
    fetchData();
  }, []);

  return (
    <>
      <Score/>
      <Board champions={filteredChampionsList}/>
    </>
  );
}

export default App;

//TODO TODO
// RIGHT NOW, our game would not work how its suppossed to !. Because it would always select NEW RANDOM X champs.
// but the way it should work, is that the list should only be randomized at the start... TODO
// I think just move the shuffle to inside the startup Effect fetch