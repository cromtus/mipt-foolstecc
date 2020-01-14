import React from 'react'
import { Link } from 'react-router-dom';
import Slider from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'
import { routeStyle, toRussianType } from '../util/RoutesStyle'
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
  <Tooltip placement="bottom" title={props.value}>{props.children}</Tooltip>
)

const RadiusSlider = props => {
  const [value, setValue] = React.useState(500);

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

const RouteItem = props => (
  <div className='route-item' {...props}>
    <div className='color-layer' style={{background: props.color}} />
    <div className='russian-type'>{toRussianType(props.route.type)}</div>
    <div className='number'>{props.route.name}</div>
    <Link className='explore' to={'/explore/' + props.route.id}>&raquo;</Link>
  </div>
)

class Panel extends React.Component {
  constructor(props) {
    super()
    this.state = {visible: false, loading: false, routes: []}
    props.store.subscribe(() => this.setState(props.store.getState().panelState))
  }

  render() {
    return (
      <div className='panel' style={{height: this.state.routes.length ? '100%' : 'auto'}}>
        {this.state.reset_visible &&
          <Button className='reset' onClick={() => this.props.store.dispatch({ type: 'RESET' })}>Сбросить</Button>
        }
        {!this.state.reset_visible &&
          <RadiusSlider store={this.props.store} />
        }
        {this.state.loading && <Loader />}
        <div className='routes-list'>
          {this.state.routes.map(route => {
            const {color, } = routeStyle(route)
            return <RouteItem color={color} route={route} key={route.id}
              onMouseOver={() => this.props.store.dispatch({ type: 'SHOW_ONLY', route_id: route.id })}
              onMouseOut={() => this.props.store.dispatch({ type: 'SHOW_ONLY', route_id: null })} />
          })}
        </div>
      </div>
    )
  }
}

export default Panel
