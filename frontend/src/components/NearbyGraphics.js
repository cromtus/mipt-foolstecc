import React from 'react'
import Axios from 'axios'
import Tooltip from '@material-ui/core/Tooltip'
import { Promise } from 'bluebird'
import { Map, TileLayer, Circle } from 'react-leaflet'
import { withSnackbar } from 'notistack'
import RouteOnMap from './RouteOnMap'
import { toRussianType } from '../util/RoutesStyle'
import '../sass/Leaflet.sass'

let requestPromise;

Promise.config({
  cancellation: true,
});

export function graphicsState(state, action) {
  switch (action.type) {
    case 'RADIUS_CHANGED':
      return {radius: action.radius, show_circle: true}
    case 'RESET':
      localStorage.circle = null
      requestPromise.cancel()
      return {circle_fixed: false, routes: []}
    case 'DB_REQUEST_SUCCEED':
      return {routes: action.data.routes}
    case 'DB_REQUEST_FAILED':
      return {circle_fixed: false}
    case 'SHOW_ONLY':
      return {show_only: action.route_id}
    default:
      return {}
  }
}

class Graphics extends React.Component {
  handleMouseMove(e) {
    if (!this.state.circle_fixed) {
      this.setState({show_circle: true, circle_latlng: e.latlng})
    }
  }

  handleMouseOver(e) {
    if (!this.state.circle_fixed) {
      this.setState({show_circle: true, circle_latlng: e.latlng})
    }
  }

  handleMouseOut(e) {
    if (!this.state.circle_fixed) {
      this.setState({show_circle: false})
    }
  }

  handleViewportChange(e) {
    localStorage.lat = e.center[0]
    localStorage.lng = e.center[1]
    localStorage.zoom = e.zoom
  }

  handleClick(e) {
    if (!this.state.circle_fixed) {
      this.process(e.latlng, this.state.radius)
    }
  }

  process(latlng, radius) {
    localStorage.circle = JSON.stringify({center: {lat: latlng.lat, lng: latlng.lng}, radius: radius})
    this.setState({show_circle:true, circle_fixed: true, circle_latlng: latlng})
    this.props.store.dispatch({ type: 'DB_REQUEST_SENT' })
    requestPromise = Promise.resolve(Axios.get('/api/nearby', {
      params: {
        lat: latlng.lat,
        lng: latlng.lng,
        radius: radius
      }
    })).then(response => {
      if (response.status === 200 && response.data.routes) {
        this.props.store.dispatch({ type: 'DB_REQUEST_SUCCEED', data: response.data })
      } else {
        this.props.store.dispatch({ type: 'DB_REQUEST_FAILED' })
        this.props.enqueueSnackbar('Ой, проблемы на стороне бэкэнда')
      }
    }).catch(() => {
      this.props.store.dispatch({ type: 'DB_REQUEST_FAILED' })
      this.props.enqueueSnackbar('У вас либо нет интернета, либо бэкэнд-сервер не запущен')
    })
  }

  componentDidMount() {
    if (this.props.circle) {
      const circle = this.props.circle
      this.process(circle.center, circle.radius)
    }
  }

  constructor(props) {
    super(props)
    let radius = 500;
    if (this.props.circle && this.props.circle.radius) {
      radius = this.props.circle.radius
    }
    this.state = {
      show_circle: false,
      circle_testing: false,
      circle_fixed: false,
      circle_latlng: null,
      radius: radius,
      routes: [],
      tooltip_text: '',
      tooltip_coords: {x: -100, y: -100}
    }
    props.store.subscribe(() => this.setState(props.store.getState().graphicsState))
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleViewportChange = this.handleViewportChange.bind(this)
  }

  render() {
    return (
      <Map
        center={[this.props.lat, this.props.lng]}
        zoom={this.props.zoom}
        onmousemove={this.handleMouseMove}
        onmouseover={this.handleMouseOver}
        onmouseout={this.handleMouseOut}
        onclick={this.handleClick}
        onViewportChanged={this.handleViewportChange}
      >
        <TileLayer url='https://{s}.tile.osm.org/{z}/{x}/{y}.png' />
        {this.state.show_circle ?
          <Circle
            center={this.state.circle_latlng}
            fillColor={this.state.circle_fixed ? 'red' : 'blue'}
            color={this.state.circle_fixed ? 'red' : 'blue'}
            radius={this.state.radius}
          />
        : null}
        {this.state.routes.filter(route => !this.state.show_only || this.state.show_only === route.id).map((route, key) => 
          <RouteOnMap route={route} key={key}
            onMouseOver={(e) => this.setState({
              tooltip_text: toRussianType(route.type) + ' ' + route.name,
              tooltip_coords: e.containerPoint
            })}
            onMouseOut={() => this.setState({tooltip_coords: {x: -100, y: -100}})}
          />
        )}
        <Tooltip open={true} title={this.state.tooltip_text}>
          <div style={{
            position: 'absolute',
            left: this.state.tooltip_coords.x,
            top: this.state.tooltip_coords.y
          }}></div>
        </Tooltip>
      </Map>
    );
  }
}

export default withSnackbar(Graphics)
