import React from "react";

export default function Card ({champion}) {
  const {name, id, img} = champion;
  return (
    <div className="card">
      <p>{id}</p>
      <h2>{name}</h2>
      <img alt={name} src={img}/>
    </div>
  )
}

//TODO.. I feel like in our championData, where we fetch the initial champions list and then do processSummary,
// which maps and simplifies each champions data, I feel like i can add a property that contains
// the img url to each champ...
// Since all I should be doing here is adding a <img src={champion.img}>