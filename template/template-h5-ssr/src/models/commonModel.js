import { Model } from "@geetemp/model";
import dotProp from "dot-prop-immutable";
import * as commonService from "services/commonService";

export default Model.getInstance(
  class extends Model {
    namespace = "common";

    state = {
      systemInfos: [],
      unread: 0,
      wxShare: {}
    };

    actions = {
      async getSystemInfos(param) {
        const res = await commonService.getSystemInfo(param);
        if (res.code === 0) {
          this.dispatch({
            type: "setSystemInfos",
            payload: (res.data.list || []).map(item => ({
              type: item.type,
              typeName: item.type_name,
              time: item.create_time_str,
              title: item.title,
              content: item.content
            }))
          });
        }
      },
      async getWxShare(param) {
        const res = await commonService.wxShare(param);
        if (res.code === 0) {
          this.dispatch({
            type: "setWXshare",
            payload: res.data
          });
        }
        return res;
      }
    };

    reducers = {
      setSystemInfos(state, { payload: systemInfos }) {
        return dotProp.set(state, "systemInfos", systemInfos);
      },
      setUnread(state, { payload: data }) {
        return { ...state, unread: data };
      },
      setWXshare(state, { payload: data }) {
        return { ...state, wxShare: data };
      }
    };
  }
);
