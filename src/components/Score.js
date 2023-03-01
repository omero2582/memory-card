import React from "react";

export default function Score ({level, numChamps}) {
  return (
    <>
      <h2>Level: {level}</h2>
      <h2>Number of Champions: {numChamps}</h2>
    </>
  )
}