import { urlEncode, parseQueryString } from "utils/url";
import { isWeChatBrowser, getDomain } from "utils/util";
const proxies = require(process.env.PACKAGE_JSON).proxy;
const _ = require("underscore");
const root = process.env.BROWSER ? require("../client") : null;

const xhr = ({ url, body = null, method = "get", nologin}, req) => {
  function transformError(response) {
    let message = "系统异常，请联系管理员";
    if (!_.isEmpty(response.msg)) {
      message = response.msg;
    }
    if (!_.isEmpty(response.data)) {
      if (_.isObject(response.data)) {
        message = _.values(response.data)[0];
      } else if (_.isString(response.data)) {
        message = response.data;
      }
    }
    return message;
  }

  function parseRequest(response) {
    response.transformError = ""; //
    if (response.code == 0 || (response.code >= 200 && response.code < 300)) {
      return response;
    } else if (response.code == 404) {
      // 这里抛出错误方便服务器端也能处理
      throw response;
    } else if (response.code == 500) {
      throw response;
    } else {
      response.transformError = transformError(response);
      return response;
    }
  }

  function handle5112(response) {
    if (process.env.BROWSER) {
      if (response.code === 5112 ) {
        root.store.dispatch({ type: "user/setUserInfo", payload: {} });
        localStorage.removeItem("user");
        console.log("sta", url, response)
        if (!nologin) {
          if (isWeChatBrowser()) {
            window.location.href = getDomain() + "/wap/v2_0/weixin/login?currentUrl=" + encodeURIComponent(root.history.location.pathname.substring(1));
          } else {
            root.history.replace("/login?redirect=" + encodeURIComponent(root.history.location.pathname));
          }
        }
      }
    }
    return response;
  }

  // function checkStatus(response) {
  //   if (response.status >= 200 && response.status < 300) {
  //     return response;
  //   } else {
  //     let error = new Error(response.statusText);
  //     error.response = response;
  //     throw error;
  //   }
  // }

  function parseJSON(response) {
    return response.json();
  }

  function log(response) {
    return response;
  }

  let headers = {
    "Content-Type": "application/json",
    Accept: "*/*"
  };

  if (req) {
    headers["Cookie"] = req.headers.cookie;
  }

  let param = {
    method: method,
    headers: headers
  };

  if (body) {
    ["post", "POST", "put", "PUT"].indexOf(method) !== -1
      ? (param.body = JSON.stringify(body))
      : (url = `${url}?${urlEncode(body)}`);
  }

  param.credentials = "include";
  return (
    fetch(url, param)
      // .then(checkStatus)
      .then(parseJSON)
      .then(parseRequest)
      .then(handle5112)
      .then(log)
      .catch(response => {
        console.error("error", response);
        if (response.code === 404) {
          // if(process.env.BROWSER){}
        } else if (response.code === 500) {
          // 重定向500
          console.log(response);
        }
      })
      .then(response => response || {})
  );
};

export function serverXhr(xhr) {
  return ({ url, body, method, nologin }) => {
    url =
      process.env.BUILD_TARGET === "server"
        ? findHost(proxies, url) + url
        : url;
    return xhr({ url, body, method, nologin });
  };
}

export function findHost(proxies, url) {
  for (const path of Object.keys(proxies)) {
    if (new RegExp(path).test(url)) {
      return proxies[path].target;
    }
  }
  return "";
}

export default serverXhr(xhr);
