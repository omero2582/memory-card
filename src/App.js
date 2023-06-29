import './App.css';
import Scoreboard from './components/Scoreboard';
import Board from './components/Board';
import { useEffect, useState, useRef } from 'react';
import championsRequest from './championsRequest';
import Advanced from './components/Advanced';

const shuffleArr = (array) => [...array].sort(() => Math.random() - 0.5);

function App() {
  const [level, setLevel] = useState(1);
  const [championsList, setChampionsList] = useState([]);
  const [championsClicked, setChampionsClicked] = useState([]);
  const [championsThisLevel, setChampionsThisLevel] = useState([]);
  // let championsThisLevel = [];
  // ^^ can be calculated using existing state, but its still better to use a state var instead
  // because of the useEffects that are convenient to use, when level or chamionsClick changes 
  const [logs, setLogs] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const textareaRef = useRef();

  const logToTextArea = (message) => {
    setLogs(l => [...l, message]);
  };

  // Inital load of all champions & images
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

  // every level, choose champs out of the initially shuffled list
  useEffect(() => {
    const pickChamps = () => {
      // Slice automatically uses array.length when you go over the limit. Dont have to worry about edge cases
      // only have to worry about the score and whether I want the Game to end
      const numChamps = 2 + 2 * level;
      const subset = championsList.slice(0, numChamps);
      return subset;
    }
    setChampionsThisLevel(pickChamps());
  }, [level, championsList])

  // every level
  useEffect(() => {
    logToTextArea(`Round ${level}`);
  }, [level])

  // anytime championsClicked changes, shuffle the current visible champions
  useEffect(() => {
    setChampionsThisLevel(c => shuffleArr(c));
  }, [championsClicked])

  const handleCardClick = (champion) => {
    if(championsClicked.some(champ => champ.id === champion.id)) { 
      logToTextArea(`Game Over, Already Clicked ${champion.name}`);
      // and reset Game ?
      // problem is, I would need to reshuffle list... can just reshuffle the state variable tho... simple ?
      setLevel(1);
      setChampionsClicked([]);
      setChampionsList(c => shuffleArr(c));
    }else {
      
      logToTextArea(`adding ${champion.name}`);
      if(championsClicked.length + 1 === championsThisLevel.length){
        setLevel(l => l + 1);
        setChampionsClicked([]); 
        // logToTextArea(`Round ${level+1}`);
      } else {
        setChampionsClicked(c => [...c, champion]);
      }
    }
  };

  return (
    <div className='container'>
      <main className='game'>
        <h1 className='main-title'>Memory Card Game</h1>
        <p>Click on every Champion once only, to get to the next level</p>
        <Scoreboard level={level} numChamps={championsThisLevel.length}/>
        <Board champions={championsThisLevel} handleCardClick={handleCardClick}/>
        <section className='options'>
          <h2 className='visually-hidden'>Options</h2>
          <button onClick={() => setLevel(l => l + 1)}>Next Level</button>
          <button onClick={() => setShowAdvanced(s => !s)}>{showAdvanced ? 'Hide' : 'Show'} Advanced</button>
        </section>
        {showAdvanced && 
        <Advanced logs={logs} championsClicked={championsClicked} textareaRef={textareaRef}/>
        }
      
      </main>
      <footer className='Footer'>
        <p>Sebastian Cevallos</p>
      </footer>
    </div>
    //{JSON.stringify(championsClicked, null, 2)}
  );
}
// have to pass championsThisLevel.length instead of 2 + 2 * level, 
// otherwise, after I hit the max number of champs, numChamps would keep increasing

export default App;
