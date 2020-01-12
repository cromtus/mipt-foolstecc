import React from 'react'
import '../sass/Panel.sass'

const Button = (props) => (
  <button className='button' type='submit' {...props}>{props.children}</button>
)

const Loader = () => <div className='loader'><div className='outer'><div className='inner' /></div></div>

export function panelState(state, action) {
  switch (action.type) {
    case 'DB_REQUEST_SENT':
      return {visible: true, loading: true}
    case 'DB_REQUEST_SUCCEED':
      return {visible: true, loading: false}
    case 'DB_REQUEST_FAILED':
      return {visible: false, loading: false}
    case 'RESET':
      return {visible: false}
    default:
      return {}
  }
}

class Panel extends React.Component {
  constructor(props) {
    super()
    this.state = {visible: false, loading: true}
    props.store.subscribe(() => this.setState(props.store.getState().panelState))
  }

  render() {
    return (
      <div className='panel' style={{display: this.state.visible ? '' : 'none'}}>
        <Button className='reset' onClick={() => this.props.store.dispatch({ type: 'RESET' })}>Сбросить</Button>
        {this.state.loading ? <Loader /> : null}
      </div>
    )
  }
}

export default Panel