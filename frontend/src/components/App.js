import React from 'react';
import { combineReducers, createStore } from 'redux'
import Graphics, {graphicsState} from './Graphics'
import Panel, {panelState} from './Panel'

import '../sass/App.sass';

const reducer = combineReducers({ panelState, graphicsState })
const store = createStore(reducer)

function App() {
  return (
    <>
      <Graphics store={store} lat={55.75} lng={37.62} zoom={11} />
      <Panel store={store} />
    </>
  );
}

export default App;
