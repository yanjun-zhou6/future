import {Loadable} from './loadable';

/**
 * This help us to get initial app state data,
 * and ensure async page component is loaded before rendering
 */
export async function ensureReady (pathname) {
  await Loadable.preloadReady ();

  let data;
  if (typeof window !== undefined && !!document) {
    // deserialize state from 'serialize-javascript' format
    data = eval (
      `(${document.getElementById ('server-app-state').textContent})`
    );
  }
  return Promise.resolve (data);
}
