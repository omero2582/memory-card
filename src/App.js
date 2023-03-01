import './App.css';
import Score from './components/Score';
import Board from './components/Board';
import { useEffect, useState } from 'react';
import championsRequest from './championsRequest';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);

function App() {
  const [level, setLevel] = useState(1);
  const [championsList, setChampionsList] = useState([]);
  const [championsClicked, setChampionsClicked] = useState([]);
  // const [championsThisLevel, setchampionsThisLevel] = useState([]); unnecessary ?? isnce it can be calculated using existing stuff
  let championsThisLevel = [];
  
  const pickChamps = () => {
    // Slice automatically uses array.length when you go over the limit. Dont have to worry about edge cases
    // only have to worry about the score and whether I want the Game to end
    const numChamps = 2 + 2 * level;
    const subset = championsList.slice(0, numChamps);
    return subset;
  }

  championsThisLevel = pickChamps();
  championsThisLevel = shuffleArr(championsThisLevel);
  // championsThisLevel.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchData = async () => {
      const championsData = await championsRequest.processSummary();
      // const shuffled = [...championsData].sort(() => Math.random() - 0.5);
      const shuffled = shuffleArr(championsData);
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

  const handleCardClick = (champion) => {
    if(championsClicked.some(champ => champ.id === champion.id)) {
      console.log(`Game Over, Already Clicked ${champion.name}`);
      // and reset Game ?
      // problem is, I would need to reshuffle list... can just reshuffle the state variable tho... simple ?
      setLevel(1);
      setChampionsClicked([]);
      setChampionsList(c => shuffleArr(c));
    }else {
      console.log(`adding ${champion.name}`);
      if(championsClicked.length + 1 === championsThisLevel.length){
        setLevel(l => l + 1);
        setChampionsClicked([]); 
        console.log(`Round ${level+1}`);
      } else {
        setChampionsClicked(c => [...c, champion]);
      }
    }
  };

  return (
    <>
      <button onClick={() => setLevel(l => l + 1)}>Next Level</button>
      <Score level={level} numChamps={championsThisLevel.length}/>
      <Board champions={championsThisLevel} handleCardClick={handleCardClick}/>
      <p>Champions Selected:</p>
      {championsClicked.map(champ => <p key={champ.id}>{champ.name}</p>)}
    </>
    //{JSON.stringify(championsClicked, null, 2)}
  );
}
// have to pass championsThisLevel.length instead of 2 + 2 * level, 
// otherwise, after I hit the max number of champs, numChamps would keep increasing

export default App;
