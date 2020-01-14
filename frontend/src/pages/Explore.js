import React from 'react'
import { useParams } from 'react-router-dom'
import { combineReducers, createStore } from 'redux'
import { SnackbarProvider } from 'notistack'

import Graphics, { graphicsState } from '../components/ExploreGraphics'
//import Panel, { panelState } from '../components/ExplorePanel'

const reducer = combineReducers({ /*panelState,*/ graphicsState })
const store = createStore(reducer)

export default function Explore() {
  const { route_id } = useParams()
  return (
    <SnackbarProvider>
      <Graphics route_id={route_id} store={store} />
    </SnackbarProvider>
  )
}