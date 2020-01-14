import React from 'react'
import { Polyline } from 'react-leaflet'
import { routeStyle } from '../util/RoutesStyle'

export default function RouteOnMap(props) {
  const route = props.route
  const {color, weight} = routeStyle(route)
  return route.runs.map((run, i) => {
    return <Polyline
      color={color} weight={weight} positions={run.points}
      key={i}
      {...props}
    />
  })
}