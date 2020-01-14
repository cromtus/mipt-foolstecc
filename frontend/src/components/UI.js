import React from 'react'

export const Button = (props) => (
  <button className='button' type='submit' {...props}>{props.children}</button>
)

export const Loader = () => <div className='loader'><div className='outer'><div className='inner' /></div></div>