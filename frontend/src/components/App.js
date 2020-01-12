import React from 'react';
import { combineReducers, createStore } from 'redux'
import { SnackbarProvider } from 'notistack';
import Graphics, { graphicsState } from './Graphics'
import Panel, { panelState } from './Panel'

import '../sass/App.sass';

const reducer = combineReducers({ panelState, graphicsState })
const store = createStore(reducer)

function App() {
  localStorage.lat = localStorage.lat || 55.75
  localStorage.lng = localStorage.lng || 37.62
  localStorage.zoom = localStorage.zoom || 11
  return (
    <SnackbarProvider>
      <Graphics store={store} lat={localStorage.lat} lng={localStorage.lng} zoom={localStorage.zoom} />
      <Panel store={store} />
    </SnackbarProvider>
  );
}

export default App;
