// import './styles/CardTheme.css'

export default function CardOptions ({cardTheme, handleCardTheme, showNames, handleShowNames}) {
  return(
    <section className='CardOptions'>
      <section className="game-theme">
        <label htmlFor="game-theme" className="game-theme-title">Card Theme:</label>
        <select id="game-theme" value={cardTheme || 'league'}  // sets price-asc as default, without changing the url
        onChange={handleCardTheme}>
          <option value='playingCards'>Playing Cards</option>
          <option value='league'>League of Legends</option>
          <option value='genshin'>Genshin Impact</option>
        </select>
      </section>
      <section className="show-names">
        <input id="show-names" type="checkbox" checked={showNames} onChange={handleShowNames}></input>
        <label htmlFor="show-names">Show Names</label>
      </section>
    </section>
  )
}