import React from 'react'
import '../sass/Panel.sass'

const Button = (props) => (
  <button className='button' type='submit' {...props}>{props.children}</button>
)

export function panelState(state, action) {
  switch (action.type) {
    case 'DB_REQUEST_SENT':
      return {visible: true}
    case 'DB_REQUEST_FINISHED':
      return {}
    case 'RESET':
      return {visible: false}
    default:
      return {}
  }
}

class Panel extends React.Component {
  constructor(props) {
    super()
    this.state = {visible: false}
    props.store.subscribe(() => this.setState(props.store.getState().panelState))
  }

  render() {
    return (
      <div className='panel' style={{display: this.state.visible ? 'block' : 'none'}}>
        <div className='top'>
          <Button className='reset' onClick={() => this.props.store.dispatch({ type: 'RESET' })}>Сбросить</Button>
        </div>
      </div>
    )
  }
}

export default Panel