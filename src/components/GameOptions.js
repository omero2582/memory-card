import './styles/GameOptions.css'

export default function GameOptions ({ handleNextLevel, handleShowAdvanced, showAdvanced}) {
  return (
    <section className='GameOptions'>
      <h2 className='visually-hidden'>Game Options</h2>
      <button onClick={handleNextLevel}>Next Level</button>
      <button onClick={handleShowAdvanced}>{showAdvanced ? 'Hide' : 'Show'} Advanced</button>
    </section>
  )
}