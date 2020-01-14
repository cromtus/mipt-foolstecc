import React from 'react'
import Slider from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'
import { RoutesList } from '../components/RoutesList'
import { Button, Loader } from '../components/UI'
import '../sass/Panel.sass'


export function panelState(state, action) {
  switch (action.type) {
    case 'DB_REQUEST_SENT':
      return {reset_visible: true, loading: true}
    case 'DB_REQUEST_SUCCEED':
      return {reset_visible: true, loading: false, routes: action.data.routes}
    case 'DB_REQUEST_FAILED':
      return {reset_visible: false, loading: false}
    case 'RESET':
      return {reset_visible: false, routes: []}
    default:
      return {}
  }
}

const ValueLabelComponent = props => (
  <Tooltip placement="bottom" title={<span>{'R = ' + props.value + ' м'}</span>}>{props.children}</Tooltip>
)

const RadiusSlider = props => {
  const [value, setValue] = React.useState(props.radius);

  const handleChange = (event, newValue) => {
    props.store.dispatch({ type: 'RADIUS_CHANGED', radius: newValue })
    setValue(newValue)
  };
  return (
    <div className='slider-wrapper'>
      <Slider
        min={100} max={1000}
        onChange={handleChange}
        ValueLabelComponent={ValueLabelComponent}
        value={value}
      />
    </div>
  )
}

class Panel extends React.Component {
  constructor(props) {
    super()
    this.state = {visible: false, loading: false, routes: []}
    props.store.subscribe(() => this.setState(props.store.getState().panelState))
  }

  render() {
    let radius = 500
    if (this.props.circle && this.props.circle.radius) {
      radius = this.props.circle.radius
    }
    return (
      <div className='panel' style={{height: this.state.routes.length ? '100%' : 'auto'}}>
        {this.state.reset_visible &&
          <Button className='reset' onClick={() => this.props.store.dispatch({ type: 'RESET' })}>Сбросить</Button>
        }
        {!this.state.reset_visible && <RadiusSlider store={this.props.store} radius={radius} />}
        {this.state.loading && <Loader />}
        <RoutesList routes={this.state.routes} soft={1}
          handleMouseOver={route_id => this.props.store.dispatch({ type: 'SHOW_ONLY', route_id })}
          handleMouseOut={() => this.props.store.dispatch({ type: 'SHOW_ONLY', route_id: null })}
        />
      </div>
    )
  }
}

export default Panel
