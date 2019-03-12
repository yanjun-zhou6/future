import React from 'react';
import {hydrate} from 'react-dom';
import {ensureReady, Nut} from 'nut';
import routes from './routes';
import createBrowserHistory from 'history/createBrowserHistory';
import {Router} from 'react-router-dom';

const history = new createBrowserHistory ();

function Root({initialProps}) {
  return (
    <Router history={history}>
      <Nut initialProps={initialProps} routes={routes} />
    </Router>
  );
}

ensureReady (routes).then (initialProps =>
  hydrate (
    <Root initialProps={initialProps} />,
    document.getElementById ('root')
  )
);

if (module.hot) {
  module.hot.accept ();
}
