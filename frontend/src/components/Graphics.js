import React from 'react'
import { Map, TileLayer, Circle } from 'react-leaflet'
import '../sass/Graphics.sass'

export function graphicsState(state, action) {
  switch (action.type) {
    case 'RESET':
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

  handleClick() {
    this.setState({circle_fixed: true})
    this.props.store.dispatch({ type: 'DB_REQUEST_SENT' })
  }

  constructor(props) {
    super()
    this.state = {
      show_circle: false,
      circle_fixed: false,
      circle_latlng: null,
      radius: 500
    }
    props.store.subscribe(() => this.setState(props.store.getState().graphicsState))
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
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
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
      </Map>
    );
  }
}

export default Graphics