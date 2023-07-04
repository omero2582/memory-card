import useGenshin from "./fetch/useGenshin";

export default function Sandbox() {
  const characters = useGenshin();
  
  return(
    <div>
      {characters.map(c => 
        <div key={c.id}>
          <p>{c.name}</p>
          <p>{c.img}</p>
          <img alt={c.name} href={c.img}></img>
        </div>
        )}
    </div>
  )
}
