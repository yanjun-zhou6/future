import { Model } from "@geetemp/model";

export default Model.getInstance(
  class extends Model {
    namespace = "TicTacToeChild";

    state = {
      param: "",
      pathname: ""
    };
  }
);
