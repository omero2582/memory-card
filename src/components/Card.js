import React from "react";

export default function Card ({champion, handleClick}) {
  const {name, id, img} = champion;
  return (
    <button className="Card" onClick={() => handleClick(champion)}>
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