import React from 'react'
import Axios from 'axios'
import { Promise } from 'bluebird';
import { Map, TileLayer, Circle, Polyline } from 'react-leaflet'
import { withSnackbar } from 'notistack';
import '../sass/Graphics.sass'

let requestPromise;

Promise.config({
  cancellation: true,
});

export function graphicsState(state, action) {
  switch (action.type) {
    case 'RESET':
      requestPromise.cancel()
      return {circle_fixed: false, routes: []}
    case 'DB_REQUEST_FAILED':
      return {circle_fixed: false}
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

  handleClick() {
    if (!this.state.circle_fixed) {
      this.setState({circle_fixed: true})
      this.props.store.dispatch({ type: 'DB_REQUEST_SENT' })
      requestPromise = Promise.resolve(Axios.get('http://localhost:8080/api/nearby', {params: {
        lat: this.state.circle_latlng.lat,
        lng: this.state.circle_latlng.lng,
        radius: this.state.radius
      }})).then(response => {
        if (response.status === 200 && response.data.routes) {
          this.props.store.dispatch({ type: 'DB_REQUEST_SUCCEED' })
          this.setState({routes: response.data.routes})
        } else {
          this.props.store.dispatch({ type: 'DB_REQUEST_FAILED' })
          alert('Ой, что-то навернулось')
        }
      }).catch(() => {
        this.props.store.dispatch({ type: 'DB_REQUEST_FAILED' })
        alert('Ой, что-то наебнулось')
      })
    }
  }

  constructor(props) {
    super()
    this.state = {
      show_circle: false,
      circle_fixed: false,
      circle_latlng: null,
      radius: 500,
      routes: []
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
        <TileLayer
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {this.state.show_circle ?
          <Circle
            center={this.state.circle_latlng}
            fillColor={this.state.circle_fixed ? 'red' : 'blue'}
            color={this.state.circle_fixed ? 'red' : 'blue'}
            radius={this.state.radius}
          />
        : null}
        {this.state.routes.map(route => route.runs.map((run, key) => (
          <Polyline positions={run.points} key />
        )))}
      </Map>
    );
  }
}

export default withSnackbar(Graphics)