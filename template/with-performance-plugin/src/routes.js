import Loading from './Loading';
import bondRctloadable from '@geetemp/nut/bondRctloadable';
import Loadable from 'react-loadable';

export default [
  {
    path: '/',
    exact: true,
    component: bondRctloadable (
      Loadable ({
        loader: () => import ('./Home'), // required
        loading: Loading, // this is optional, just returns null by default
      })
    ),
  },
  {
    path: '/about',
    exact: true,
    component: bondRctloadable (
      Loadable ({
        loader: () => import ('./About'), // required
        loading: Loading, // this is optional, just returns null by default
      })
    ),
  },
];
