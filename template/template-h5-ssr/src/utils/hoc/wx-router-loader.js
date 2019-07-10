import React from "react";
import { withRouter, matchPath } from "react-router-dom";
import { connect } from "react-redux";
import { isWeChatBrowser, getDomain } from "utils/util";
import { parseQueryString } from "utils/url";
import commonModel from "models/commonModel";

const { getWxShare } = commonModel.actions;
// var wx = require('weixin-js-sdk');
const whiteList = ["/login", "/register"];
const wx = window.wx;
console.log(wx);
export const WXLoader = withRouter(
  connect(
    ({ home, user }) => {
      return { ...home, user };
    },
    { getWxShare }
  )(
    class extends React.Component {
      state = {};
      shareCallback = (res, href, domain) => {
        if (!res) return;
        if (res.code === 5112) {
          return;
        } else if (res.code !== 0) {
          return;
        }
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appid, // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.noncestr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，见附录1
          jsApiList: [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "updateAppMessageShareData",
            "updateTimelineShareData"
          ]
        });
        // wx.ready(function() {
        //   console.log("ssss");
        //   var so = {
        //     title: "招人快，上即派，人才按月租用，灵活安全",
        //     desc: "想要候选人1天面试，1周就到岗？点击体验",
        //     link: res.data.url,
        //     imgUrl: domain + "/public/share.png"
        //   };
        //   var shareTimeline = {
        //     title: "招人快，上即派，人才按月租用，灵活安全",
        //     desc: "想要候选人1天面试，1周就到岗？点击体验",
        //     link: res.data.url,
        //     imgUrl: domain + "/public/share.png"
        //   };
        //   wx.onMenuShareAppMessage(so);
        //   wx.onMenuShareTimeline(shareTimeline);
        // });
      };
      componentDidMount() {
        const { routes, location, history, getWxShare, user } = this.props;
        // 权限需要的登录
        // routes.forEach(currentItem => {
        //   let currentMatch = matchPath(location.pathname, currentItem);
        //   if (currentItem.needUser && currentMatch && !user.info.id) {
        //     if (isWeChatBrowser()) {
        //       window.location.href = getDomain() + "/wap/v2_0/weixin/login?currentUrl=" + encodeURIComponent(history.location.pathname.substring(1));
        //     } else {
        //       history.replace("/login?redirect=" + encodeURIComponent(history.location.pathname));
        //     }
        //   }
        // });
        let href = window.location.href;
        let domain = window.location.protocol + "//" + window.location.hostname;
        this.unListen = history.listen((location, action) => {
          href = window.location.href;
          domain = window.location.protocol + "//" + window.location.hostname;
          // location is an object like window.location
          console.log(
            action,
            window.location,
            location,
            location.pathname,
            location.state
          );
          // 获取设备信息，根据项目配置url
          // getWxShare({ url: href }).then(res => {
          //   this.shareCallback(res, href, domain);
          // })
        });
        // getWxShare({ url: href }).then(res => {
        //   this.shareCallback(res, href, domain);
        // });
      }

      componentWillUnmount() {
        this.unListen();
      }

      render() {
        return this.props.children;
      }
    }
  )
);
