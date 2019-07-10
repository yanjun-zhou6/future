import { Model } from "@geetemp/model";
import { Toast } from "@geetemp/gee-ui-mobile";
import dotProp from "dot-prop-immutable";
import * as userService from "services/userService";
// const history = process.env.BROWSER ? require("utils/history").default : null;
// const root = process.env.BROWSER ? require("../../client") : null;

export default Model.getInstance(
  class extends Model {
    namespace = "user";

    state = {
      info: {},

      loginRegistModal: false,

      login: {
        visible: false
      },

      register: {
        visible: false,
        completeInfo: {
          visible: false
        }
      },

      threePartLogin: {
        stateKey: "",
        visible: false
      },
      pathname: "",
      forgetPwd: {
        visible: false
      },
      centerInfo: {}, //个人中心信息
      option: {}, //编辑选项
      isNewStatus: false, //新登录页状态
      personParam: {}, //个人信息参数
      systemList: {}, //系统通知列表
      systemLIstParam: {
        page: 1,
        pages: 10
      } //系统通知列表参数
    };

    actions = {
      async generalLogin(param) {
        const res = await userService.login(param);
        if (res.code === 0) {
          this.dispatch({
            type: "setUserInfo",
            payload: res.data
          });
          //store user info to localStorage
          localStorage.setItem("user", JSON.stringify(res.data));
        }
        return res;
      },

      async quickLogin(param, isThree) {
        const res = await userService.quickLogin(param);
        if (res.code === 0) {
          this.dispatch({
            type: "setUserInfo",
            payload: res.data
          });
          //store user info to localStorage
          localStorage.setItem("user", JSON.stringify(res.data));
        }
        return res;
      },

      async sendQuickMsg(param) {
        const res = await userService.sendQuickMsg(param);
        if (res.code != 0) {
          Toast.info(res.transformError, 1);
        }
        return res;
      },

      async sendMsg(param) {
        const res = await userService.sendMsg(param);
        if (res.code != 0) {
          Toast.info(res.transformError, 1);
        }
        return res;
      },

      async sendSmsWithGrap(param) {
        const res = await userService.getSmsWithGrap(param);
        if (res.code != 0) {
          Toast.info(res.transformError, 1);
        }
        return res;
      },

      async regist(param, isThree) {
        const res = await userService.regist(param);
        if (res.code === 0) {
        }
        return res;
      },

      async completeUserInfo(param) {
        const { stateKey } = this.getState().user.threePartLogin;
        const res = await userService.completeInfo(param);
        if (res.code === 0) {
          // this.dispatch({
          //   type: "toggleRegComplete",
          //   payload: false
          // });
          //注册成功默认登录
          this.dispatch({
            type: "setUserInfo",
            payload: res.data
          });
          //存储用户信息到localStorage上
          localStorage.setItem("user", JSON.stringify(res.data));
          // const pathname = this.getState().user.pathname;
          // if (pathname !== "/") window.location.href = pathname;
        }
        return res;
      },

      async forgetPwdReset(param) {
        const res = await userService.forgetPwdReset(param);
        if (res.code === 0) {
          // this.dispatch({
          //   type: "toggleForgetPwd",
          //   payload: false
          // });
        }
        return res;
      },

      async resetPwd(param) {
        const res = await userService.resetPwd({
          new_password: param.password,
          code: param.validateCode,
          captcha: param.graphValidateCode
        });
        return res;
      },

      async logout() {
        const res = await userService.logout();
        if (res.code === 0) {
          this.dispatch({
            type: "setUserInfo",
            payload: {}
          });
          localStorage.removeItem("user");
        }
        return res;
      },

      async bindedLogin() {
        const res = await userService.getUserInfo();
        if (res.code === 0) {
          this.dispatch({
            type: "setUserInfo",
            payload: res.data
          });
          //存储用户信息到localStorage上
          localStorage.setItem("user", JSON.stringify(res.data));
        }
        return res;
      },

      async modifyUserPhone(param) {
        const res = await userService.modiyPhone({
          ...param,
          captcha: param.graphValidateCode
        });
        if (res.code === 0) {
          this.dispatch({
            type: "modifyUserInfo",
            payload: { key: "phone", value: param.phone }
          });
          const { info } = this.getState().user;
          localStorage.setItem("user", JSON.stringify(info));
        }
        return res;
      },

      async modifyUserEmail(param) {
        const res = await userService.modifyEmail({
          ...param,
          captcha: param.graphValidateCode
        });
        if (res.code === 0) {
          this.dispatch({
            type: "modifyUserInfo",
            payload: { key: "email", value: param.email }
          });
          const { info } = this.getState().user;
          localStorage.setItem("user", JSON.stringify(info));
        }
        return res;
      },

      async getPersonageInfo() {
        const res = await userService.personageInfo();
        if (res.code === 0) {
          this.dispatch({
            type: "setUpdateState",
            payload: { filed: "centerInfo", value: res.data }
          });
        }
        return res;
      },

      async editCompany(param) {
        const res = await userService.editCompany(param);
        return res;
      },

      async companyCertification(param) {
        const res = await userService.companyCertification(param);
        return res;
      },

      async modifyPersonInfo(param) {
        const res = await userService.modifyPersonInfo(param);
        if (res.code === 0) {
          const { info } = this.getState().user;
          const newInfo = { ...info, ...param };
          this.dispatch({
            type: "setUserInfo",
            payload: newInfo
          });
          localStorage.setItem("user", JSON.stringify(newInfo));
        }
        return res;
      },

      async unbindThreePart(param) {
        const res = await userService.unbindThreePart(param);
        if (res.code === 0) {
          const { app_type } = param;
          this.dispatch({
            type: "modifyUserInfo",
            payload: {
              key:
                app_type === 1
                  ? "is_bind_wechat"
                  : app_type === 2
                  ? "is_bind_qq"
                  : "is_bind_weibo",
              value: 0
            }
          });
          const { info } = this.getState().user;
          localStorage.setItem("user", JSON.stringify(info));
        }
        return res;
      },
      async getSystemMessage(param, nextPage) {
        if (!nextPage) {
          this.dispatch({
            type: "setUpdateState",
            payload: {
              filed: "systemList",
              value: { list: [] }
            }
          });
        }
        const res = await userService.systemMessage(param);
        if (res.code === 0) {
          this.dispatch({
            type: `${!nextPage ? "setUpdateState" : "updateList"}`,
            payload: { filed: "systemList", value: res.data }
          });
        }
        return res;
      }
    };

    reducers = {
      setUserInfo(state, { payload: info }) {
        return dotProp.set(state, "info", info);
      },

      toggleLoginAndRegist(state, { payload: visible }) {
        let lastState = dotProp.set(state, "login.visible", visible);
        lastState = dotProp.set(lastState, "register.visible", !visible);
        return dotProp.set(lastState, "loginRegistModal", true);
      },

      closeLoginOrRegist(state) {
        return dotProp.set(state, "loginRegistModal", false);
      },

      toggleRegister(state, { payload: visible }) {
        return dotProp.set(state, "register.visible", visible);
      },

      toggleRegComplete(state, { payload: visible }) {
        return dotProp.set(state, "register.completeInfo.visible", visible);
      },

      toggleForgetPwd(state, { payload: visible }) {
        return dotProp.set(state, "forgetPwd.visible", visible);
      },
      setUpdateState(state, { payload }) {
        const { filed, value } = payload;
        state[filed] = value;
        return { ...state };
      },
      toggleThreePart(state, { payload: visible }) {
        return dotProp.set(state, "threePartLogin.visible", visible);
      },

      setThPartStateKey(state, { payload: stateKey }) {
        return dotProp.set(state, "threePartLogin.stateKey", stateKey);
      },

      setThPartPathname(state, { payload: pathname }) {
        return dotProp.set(state, "threePartLogin.pathname", pathname);
      },

      modifyUserInfo(state, { payload: modifyItem }) {
        const { key, value } = modifyItem;
        return dotProp.set(state, `info.${key}`, value);
      },

      setPathname(state, { payload: pathname }) {
        return dotProp.set(state, "pathname", pathname);
      },
      setUpdateState(state, { payload }) {
        const { filed, value } = payload;
        state[filed] = value;
        return { ...state };
      },
      updateList(state, { payload }) {
        const { filed, value } = payload;
        state[filed] = {
          ...value,
          list: state[filed].list.concat(value.list),
          page: value.page
        };
        return { ...state };
      }
    };
  }
);
