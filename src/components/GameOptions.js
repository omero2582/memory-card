import './styles/GameOptions.css'

export default function GameOptions ({ handleLevel, handleShowAdvanced, showAdvanced}) {
  return (
    <section className='GameOptions'>
      <h2 className='visually-hidden'>Game Options</h2>
      <button onClick={() => handleLevel(l => l + 1)}>Next Level</button>
      <button onClick={() => handleShowAdvanced(s => !s)}>{showAdvanced ? 'Hide' : 'Show'} Advanced</button>
    </section>
  )
}