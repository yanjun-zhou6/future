import xhr from "./index";

// 首页人选
export function getQualityRecoms(param) {
  return xhr({ url: "/wap/v2_0/profile/indexList", body: param, method: "POST" });
}

// 首页内容
export function getnewsList(param) {
  return xhr({ url: "/wap/v2_0/home/indexContent", body: param, method: "GET" });
}

/**
 * 广告接口
 */
export function ads(param) {
  return xhr({ url: "/wap/v2_0/home/indexImg", body: param, method: "GET" });
}

