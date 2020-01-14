import React from 'react'
import { withSnackbar } from 'notistack'
import Axios from 'axios'
import { Map, TileLayer } from 'react-leaflet'
import RouteOnMap from './RouteOnMap'

function loadRoute(route_id, store) {
  Axios.get(
    'http://' + window.location.hostname + ':8080/api/route',
    {
      params: {
        id: route_id
      }
    }
  ).then(response => {
    if (response.status === 200 && response.data.route) {
      store.dispatch({ type: 'ROUTE_LOADED', route: response.data.route })
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
    case 'NEED_TO_LOAD':
      loadRoute(action.route_id, action.store)
      return {}
    case 'ROUTE_NOT_LOADED':
      return {tooltip: action.tooltip}
    case 'ROUTE_LOADED':
      return {route: action.route}
    default:
      return {}
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
      this.setState()
    })
    props.store.dispatch({ type: 'NEED_TO_LOAD', route_id: props.route_id, store: props.store })
  }

  render() {
    return (
      <Map center={[55.75, 37.62]} zoom={11}>
        <TileLayer url='https://{s}.tile.osm.org/{z}/{x}/{y}.png' />
        {this.state.route && 
          <RouteOnMap route={this.state.route} />
        }
      </Map>
    );
  }
}

export default withSnackbar(Graphics)
