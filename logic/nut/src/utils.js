export const isFunction = obj => "function" === typeof obj;

export const isObject = obj => obj !== null && typeof obj === "object";

/**
 * is value a promise object
 * @param {*} value
 */
export function isPromise(value) {
  return isObject(value) && isFunction(value.then);
}
