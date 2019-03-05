/**
 * This help us to get initial app state data
 */
export async function ensureReady() {
  let data;
  if (typeof window !== undefined && !!document) {
    // deserialize state from 'serialize-javascript' format
    data = eval(`(${document.getElementById("server-app-state").textContent})`);
  }
  return Promise.resolve(data);
}
