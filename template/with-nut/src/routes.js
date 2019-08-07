import React from 'react';
import Loading from './Loading';

import {Loadable} from '@geetemp/nut';

export default [
  {
    path: '/',
    exact: true,
    component: Loadable ({
      loader: () => import ('./Home'), // required
      loading: Loading, // this is optional, just returns null by default
      modules: ['./Home'],
      webpack: () => [require.resolveWeak ('./Home')],
    }),
  },
  {
    path: '/about',
    exact: true,
    component: Loadable ({
      loader: () => import ('./About'), // required
      loading: () => <div>...LOADING...</div>, // this is optional, just returns null by default
      modules: ['./About'],
      webpack: () => [require.resolveWeak ('./About')],
    }),
  },
];
