import xhr from "./index";
import cacheOptions from "../utils/cacheOptions";

export function getCommonDataWithoutCache(dataNameArray = []) {
  return xhr({
    url: `/wap/v2_0/common/static`,
    body: { data_name: dataNameArray.join(",") },
    method: "GET",
    nologin: true
  });
}

export const commonData = cacheOptions((dataNameArray = []) =>
  xhr({
    url: `/wap/v2_0/common/static`,
    body: { data_name: dataNameArray.join(",") },
    method: "GET"
  })
);

/**
 * 意见反馈
 * @param {*} param
 */
export function feedback(param) {
  return xhr({ url: "/wap/v2_0/home/feedback", body: param, method: "POST" });
}

/**
 * 获取系统信息
 */
export function getSystemInfo(param) {
  return xhr({ url: "/wap/v2_0/message/list", body: param, method: "GET" });
}


/**
 * 获取系统信息
 */
export function wxShare(param) {
  return xhr({ url: "/wap/v2_0/wxShare/getSignPackage", body: param, method: "POST" });
}
