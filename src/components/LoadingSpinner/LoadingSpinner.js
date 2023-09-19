import React from 'react'
import './LoadingSpinner.scss'

export default function LoadingSpinner({showText, width = 40, sx, colorPrimary= '#000', colorSecondary = 'rgba(0, 0, 0, 0.15)'}) {
  let borderColor = {
    borderRightColor: colorSecondary,
    borderLeftColor: colorSecondary,
    borderBottomColor: colorSecondary
  }
  return (
    <section className='loading' style={{...sx}}>
      <div className='loading-spinner' style={{width, height:width, ...borderColor, borderTopColor: colorPrimary}}></div>
      { showText && <h2 className='loading-text'>Loading...</h2>}
    </section>
  )
}
