import React from 'react'
import { Link } from 'react-router-dom';

import { routeStyle, toRussianType } from '../util/RoutesStyle'


const RouteItem = props => (
  <div className={props.soft ? 'route-item' : 'route-item click'} {...props}>
    <div className='color-layer' style={{background: props.color}} />
    <div className='russian-type'>{toRussianType(props.route.type)}</div>
    <div className='number'>{props.route.name}</div>
    <Link className='explore' to={'/' + props.route.id}>&raquo;</Link>
  </div>
)

export const RoutesList = props => (
  <div className='routes-list'>
    {props.routes.map(route => {
      const {color, } = routeStyle(route)
      return <RouteItem color={color} route={route} key={route.id} soft={props.soft}
        onMouseOver={props.handleMouseOver && (() => props.handleMouseOver(route.id))}
        onMouseOut={props.handleMouseOut && (() => props.handleMouseOut(route.id))}
        onClick={props.handleClick && (() => props.handleClick(route.id))}
      />
    })}
  </div>
)