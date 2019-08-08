import React from 'react';
import {hydrate} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {ensureReady, Nut} from '@geetemp/nut';
import Loadable from 'react-loadable';
import routes from './routes';
import './client.css';

window.main = () => {
  Promise.all ([Loadable.preloadReady (), ensureReady ()]).then (res => {
    const initialProps = res[1];
    hydrate (
      <BrowserRouter>
        <Nut initialProps={initialProps} routes={routes} />
      </BrowserRouter>,
      document.getElementById ('root')
    );
  });
};

if (module.hot) {
  module.hot.accept ();
}
