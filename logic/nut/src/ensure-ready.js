import { matchPath } from "react-router-dom";
import * as utils from "./utils";

/**
 * This help us to get initial app state data,
 * and ensure async page component is loaded before rendering
 */
export async function ensureReady(routes, pathname) {
  await Promise.all(
    routes.map(route => {
      const match = matchPath(pathname || window.location.pathname, route);
      if (match && route && route.component && route.component.load) {
        return route.component.load();
      }
      return undefined;
    })
  );

  let data;
  if (typeof window !== undefined && !!document) {
    // deserialize state from 'serialize-javascript' format
    data = eval(`(${document.getElementById("server-app-state").textContent})`);
  }
  return Promise.resolve(data);
}
