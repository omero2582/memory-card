import './App.css';
import Score from './components/Score';
import Board from './components/Board';
import { useEffect, useState } from 'react';
import championsRequest from './championsRequest';


function App() {
  const [level, setLevel] = useState(1);
  const [championsList, setChampionsList] = useState([]);
  // const [filteredChampionsList, setFilteredChampionsList] = useState([]); unnecessary ?? isnce it can be calculated using existing stuff
  let filteredChampionsList = [];
  
  const pickChamps = () => {
    // TODO TODO. How do I handle the edge case where I add the max number of champs ?
    // Also, what happens in the edge case where I try to add 2 more champs, but there is only 1 last champ remaining to add ?
    // ^^ dont have to worry about this, since slice automatically uses array.length when you go over the limit
    // only have to worry about the score and whether I want the Game to end
    const numChamps = 2 + 2 * level;
    const subset = championsList.slice(0, numChamps);
    return subset;
  }

  filteredChampionsList = pickChamps();
  filteredChampionsList.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchData = async () => {
      const championsData = await championsRequest.processSummary();
      const shuffled = [...championsData].sort(() => Math.random() - 0.5);
      setChampionsList(shuffled);

      // Preload all images
      const images = shuffled.map(champ => {
        const img = new Image();
        img.src = champ.img;
        return img;
      });
    }
    fetchData();
  }, []);

  return (
    <>
      <button onClick={() => setLevel(l => l + 1)}>Next Level</button>
      <Score level={level} numChamps={filteredChampionsList.length}/>
      <Board champions={filteredChampionsList}/>
    </>
  );
}
// have to pass filteredChampions.length instead of 2 + 2 * level, 
// otherwise, after I hit the max number of champs, numChamps would keep increasing

export default App;

//TODO TODO
// add a nextLevel button that just increases the Level by 1
// Use this button to test & solve the logic for edge cases

//TODO TODO
// need to shuffle our filtered List as well each time
// also out image loading seems quite slow... maybe we have to just downlaod all the images..
// But then our game would be outdated on each champ release.. hm...