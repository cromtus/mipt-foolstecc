import React from 'react'
import { withSnackbar } from 'notistack'
import Axios from 'axios'
import { Map, TileLayer } from 'react-leaflet'
import { toRussianType } from '../util/RoutesStyle'
import RouteOnMap from './RouteOnMap'

import '../sass/App.sass'

function routeTitle(route) {
  return toRussianType(route.type) + ' ' + route.name
}

function loadRoute(route_id, store) {
  Axios.get('/api/route', {
    params: {id: route_id}
  }).then(response => {
    if (response.status === 200 && response.data.id) {
      store.dispatch({ type: 'ROUTE_LOADED', route: response.data })
    } else {
      store.dispatch({ type: 'ROUTE_NOT_LOADED', tooltip: {
        text: 'Ой, проблемы на стороне бэкэнда'
      } })
    }
  }).catch(() => {
    store.dispatch({ type: 'ROUTE_NOT_LOADED', tooltip: {
      text: 'У вас либо нет интернета, либо бэкэнд-сервер не запущен'
    } })
  })
}

export function graphicsState(state, action) {
  switch (action.type) {
    case 'ROUTE_NOT_LOADED':
      return {tooltip: action.tooltip}
    case 'ROUTE_LOADED':
      return {route: action.route}
    default:
      return {}
  }
}

function getBounds(route) {
  let allPoints = []
  route.runs.forEach(run => allPoints = allPoints.concat(run.points))
  return [
    allPoints.reduce((prev, cur) => [Math.min(prev[0], cur[0]), Math.min(prev[1], cur[1])]),
    allPoints.reduce((prev, cur) => [Math.max(prev[0], cur[0]), Math.max(prev[1], cur[1])])
  ]
}

class GraphicsWrapper extends React.Component {
  componentDidMount() {
    loadRoute(this.props.route_id, this.props.store)
  }

  componentDidUpdate() {
    loadRoute(this.props.route_id, this.props.store)
  }

  render() {
    return <Graphics {...this.props} />
  }
}

class Graphics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      route: null
    }
    props.store.subscribe(() => {
      const newState = props.store.getState().graphicsState
      if (newState.tooltip) {
        this.props.enqueueSnackbar(newState.tooltip.text)
      }
      this.setState(newState)
    })
  }

  render() {
    const map_props = this.state.route ? {
      bounds: getBounds(this.state.route)
    } : {
      center: [55.75, 37.62],
      zoom: 11
    }
    if (this.state.route) {
      window.document.title = routeTitle(this.state.route)
    }
    return (
      <>
        {this.state.route &&
          <div style={{
            position: "absolute",
            zIndex: 100500,
            background: "white",
            padding: '5px 8px',
            margin: '10px 0 0 50px',
            boxShadow: 'rgba(0, 0, 0, .5) 0 0 5px'
          }}
          >{routeTitle(this.state.route)}</div>}
        <Map {...map_props}>
          <TileLayer url='https://{s}.tile.osm.org/{z}/{x}/{y}.png' />
          {this.state.route && 
            <RouteOnMap route={this.state.route} />
          }
        </Map>
      </>
    );
  }
}

export default withSnackbar(GraphicsWrapper)
