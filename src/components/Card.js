import React, {useState} from "react";
import './styles/Card.css'

export default function Card ({champion, onClick}) {
  const {name, id, img} = champion;
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(true);
    onClick(champion);
    setTimeout(() => {
      setClicked(false)
    }, 250)
  }
  return (
    <button className={`Card ${clicked ? 'clicked' : '' }`} onClick={handleClick}>
      {/* <p>{id}</p> */}
      <h3 className="card-name">{name}</h3>
      <img className="card-img" alt={name} src={img}/>
    </button>
  )
}

//TODO.. I feel like in our championData, where we fetch the initial champions list and then do processSummary,
// which maps and simplifies each champions data, I feel like i can add a property that contains
// the img url to each champ...
// Since all I should be doing here is adding a <img src={champion.img}>