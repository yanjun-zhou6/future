export const isFunction = obj => "function" === typeof obj;

export const isObject = obj => obj !== null && typeof obj === "object";

/**
 * is value a promise object
 * @param {*} value
 */
export function isPromise(value) {
  return isObject(value) && isFunction(value.then);
}

/**
 * judge browser environment
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * judge is jsx
 */
export function isJSX(jsx) {
  return "type" in jsx && "key" in jsx && "ref" in jsx;
}
