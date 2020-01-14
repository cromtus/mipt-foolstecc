import React from 'react'
import { Polyline, Circle, Tooltip } from 'react-leaflet'
import { routeStyle } from '../util/RoutesStyle'

export default function RouteOnMap(props) {
  const route = props.route
  const {color, weight} = routeStyle(route)
  return <>
    {route.runs.map((run, i) => (
      <Polyline
        color={color} weight={weight} positions={run.points}
        key={i}
        {...props}
      />
    ))}
    {route.stops && route.stops.map((stop, i) => (
      <Circle center={[stop.lat, stop.lng]} key={i}>
        <Tooltip>{stop.name}</Tooltip>
      </Circle>
    ))}
  </>
}