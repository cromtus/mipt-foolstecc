import React from 'react'
import Axios from 'axios'
import { RoutesList } from './RoutesList'
import { Loader } from '../components/UI'

export function panelState(state, action) {
  switch (action.type) {
    case 'ROUTE_NOT_LOADED':
      return {loading: false}
    case 'ROUTE_LOADED':
      return {loading: false, route: action.route}
    default:
      return {}
  }
}

export default class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      suggestion_loading: false,
      loading: true,
      routes: [],
      route: null
    }
    props.store.subscribe(() => this.setState(props.store.getState().panelState))
  }

  render() {
    return (
      <div className='panel' style={{height: this.state.routes.length ? '100%' : 'auto'}}>
        {!this.state.loading && 
          <input className='search-input' placeholder='Найти маршрут..' 
            onKeyUp={e => {
              const pattern = e.target.value
              if (pattern === '') {
                this.setState({routes: []})
                return
              }
              this.setState({suggestion_loading: true})
              Axios.get(
                'http://' + window.location.hostname + ':8080/api/search',
                {
                  params: {pattern}
                }
              ).then(response => {
                if (response.status === 200 && typeof response.data === "object") {
                  this.setState({suggestion_loading: false, routes: response.data})
                } else {
                  this.setState({suggestion_loading: false})
                }
              }).catch(() => {
                this.setState({suggestion_loading: false})
              })
            }}
          />
        }
        {this.state.loading && <Loader />}
        <RoutesList routes={this.state.routes} soft={0} />
      </div>
    )
  }
}