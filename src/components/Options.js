export default function Options ({ handleLevel, handleShowAdvanced, showAdvanced}) {
  return (
    <section className='options'>
      <h2 className='visually-hidden'>Options</h2>
      <button onClick={() => handleLevel(l => l + 1)}>Next Level</button>
      <button onClick={() => handleShowAdvanced(s => !s)}>{showAdvanced ? 'Hide' : 'Show'} Advanced</button>
    </section>
  )
}