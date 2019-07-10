import xhr from "./index";

function login(param) {
  return xhr({ url: "/wap/v2_0/user/login", body: param, method: "POST" });
}

function regist(param) {
  return xhr({
    url: "/wap/v2_0/register/register",
    body: param,
    method: "POST"
  });
}

function completeInfo(param) {
  return xhr({
    url: "/wap/v2_0/register/refineUser",
    body: param,
    method: "POST"
  });
}

function sendMsg(param) {
  return xhr({
    url: "/wap/v2_0/register/sendmsg",
    body: param,
    method: "POST"
  });
}

function quickLogin(param) {
  return xhr({ url: "/wap/v2_0/user/authLogin", body: param, method: "POST" });
}

function sendQuickMsg(param) {
  return xhr({
    url: "/wap/v2_0/user/sendAuthMsg",
    body: param,
    method: "POST"
  });
}

function logout() {
  return xhr({ url: "/wap/v2_0/user/logout", method: "GET" });
}

function forgetPwdReset(param) {
  return xhr({ url: "/wap/v2_0/user/forgetPwd", body: param, method: "POST" });
}

function getSmsWithGrap(param) {
  return xhr({ url: "/wap/v2_0/user/sendMsg", body: param, method: "POST" });
}

function resetPwd(param) {
  return xhr({ url: "/wap/v2_0/user/resetPwd", body: param, method: "POST" });
}
//个人中心信息
function personageInfo(param) {
  return xhr({ url: "/wap/v2_0/center/index", body: param, method: "GET", nologin: true });
}
//个人中心公司编辑
function editCompany(param) {
  return xhr({
    url: "/wap/v2_0/center/editCompany",
    body: param,
    method: "POST"
  });
}
//公司认证
function companyCertification(param) {
  return xhr({ url: "/wap/v2_0/center/toCheck", body: param, method: "POST" });
}

function threepartSms(param) {
  return xhr({
    url: "/wap/v2_0/register/bindSendMsg",
    body: param,
    method: "POST"
  });
}

function getUserInfo() {
  return xhr({
    url: "/wap/v2_0/user/islogin",
    method: "GET"
  });
}

function modiyPhone(param) {
  return xhr({ url: "/wap/v2_0/user/editPhone", body: param, method: "POST" });
}

function getEmailCode(param) {
  return xhr({
    url: "/wap/v2_0/user/sendEmailCode",
    body: param,
    method: "POST"
  });
}

function modifyEmail(param) {
  return xhr({ url: "/wap/v2_0/user/editEmail", body: param, method: "POST" });
}

function modifyPersonInfo(param) {
  return xhr({ url: "/wap/v2_0/center/editInfo", body: param, method: "POST" });
}

function unbindThreePart(param) {
  return xhr({ url: "/wap/v2_0/center/unbind", body: param, method: "POST" });
}

function getThreePartInfo(param) {
  return xhr({ url: "/wap/v2_0/user/thirdInfo", body: param, method: "GET" });
}
function systemMessage(param) {
  return xhr({ url: "/wap/v2_0/message/list", body: param, method: "GET" });
}


export {
  login,
  regist,
  completeInfo,
  sendMsg,
  quickLogin,
  sendQuickMsg,
  logout,
  forgetPwdReset,
  getSmsWithGrap,
  resetPwd,
  threepartSms,
  getUserInfo,
  modiyPhone,
  getEmailCode,
  modifyEmail,
  personageInfo,
  editCompany,
  companyCertification,
  modifyPersonInfo,
  unbindThreePart,
  getThreePartInfo,
  systemMessage,
};
