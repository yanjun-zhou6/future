import { Model } from "@geetemp/model";
import { Toast } from "@geetemp/gee-ui-mobile";
import dotProp from "dot-prop-immutable";
import * as indexService from "services/indexService";
const history = process.env.BROWSER ? require("utils/history").default : null;

export default Model.getInstance(
  class extends Model {
    namespace = "home";
    state = {
      recommendTalents: [],
      selectPos: {},
      selectedCity: {}
    };
    actions = {
      async getRecommendHome(param) {
        const res = await indexService.getQualityRecoms(param);
        if (res.code === 0) {
          this.dispatch({
            type: "setUpdateState",
            payload: {
              filed: "recommendTalents",
              value: res.data || []
            }
          });
        }
        return res;
      }
    };
    reducers = {
      setUpdateState(state, { payload }) {
        const { filed, value } = payload;
        state[filed] = value;
        return { ...state };
      },
      setSelectedCity(state, { payload: selectedCity }) {
        return dotProp.set(state, "selectedCity", selectedCity);
      },
      setSelectPos(state, { payload: selectPos }) {
        return dotProp.set(state, "selectPos", selectPos);
      }
    };
  }
);
