import React from 'react';
import { combineReducers, createStore } from 'redux'
import { SnackbarProvider } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import Graphics, { graphicsState } from '../components/NearbyGraphics'
import Panel, { panelState } from '../components/NearbyPanel'
import { Button } from '../components/UI'

import '../sass/App.sass';

const reducer = combineReducers({ panelState, graphicsState })
const store = createStore(reducer)

function Help() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{position: 'absolute', zIndex: 100500, margin: 15, bottom: 0, left: 0}}>
      <Button onClick={handleClickOpen}>Что?</Button>
      <Dialog open={open} onClose={handleClose}>
        <div style={{padding: 20, width: 300}}>
          Щёлкните по карте, и она вам покажет маршруты, чьи остановки попадают внутрь окружности.
          Радиус окружности можно менять ползунком справа вверху.<br />
          <Button style={{marginTop: 20}} onClick={handleClose}>Понял</Button>
        </div>
      </Dialog>
    </div>
  )
}

function Nearby() {
  localStorage.lat = localStorage.lat || 55.75
  localStorage.lng = localStorage.lng || 37.62
  localStorage.zoom = localStorage.zoom || 11
  return (
    <SnackbarProvider>
      <Graphics store={store} lat={localStorage.lat} lng={localStorage.lng} zoom={localStorage.zoom} />
      <Panel store={store} />
      <Help />
    </SnackbarProvider>
  );
}

export default Nearby;
