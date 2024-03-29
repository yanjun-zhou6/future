## 如何使用
使用OOP把状态，action，reducer函数组织在一个实例对象中，去除Redux boilerplate。以一个具体的model实现来熟悉如何使用它。

```js
import Model from "@geetemp/model";

export default Model.getInstance(
  class extends Model {
    namespace = "TicTacToe";

    state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      historySelectText: ""
    };

    actions = {
      async handleClickWithout(index) {
        return await new Promise((resolve, reject) => {
          setTimeout(() => {
            this.dispatch({
              type: "TicTacToe/handleClick",
              payload: index
            });
            resolve("complete");
          }, 1000);
        });
      }
    };

    reducers = {
      handleClick(state, { payload: index }) {
        const history = state.history.slice(0, state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[index]) {
          return state;
        }
        squares[index] = state.xIsNext ? "X" : "O";
        return {
          ...state,
          history: history.concat([
            {
              squares
            }
          ]),
          stepNumber: history.length,
          xIsNext: !state.xIsNext
        };
      }
    };
  }
);
```

代码第一行 import 的 Model 类是我们的基础类，所有 model 的实现都要继承自它，就像第三行代码的`class extends Model`。`Model.getInstance`是 Model 的一个静态方法，用来实例化你的 model 类。

继续看下类中的定义，namespace 定义命名空间，用以区分其他的 model。state 是 model 状态的定义。异步 action function 需要在 actions 中定义。reducers，顾名思义，是用来定义 redcuer 的，另外同步的 action function 会自动根据 reducer 生成。比如，handleClick 这个 recuder,相应会有一个 handleClick 名称的 action，该 action 在`Model.getInstance`实例化的对象中。

在页面组件中，使用 redux connect 函数连接 model 实例的 actions，就能实现在 view 中发送 action 到 store; 另外与页面相关 store 状态的注入，使用`namespace`定义的名称来获取,因为与页面相关状态数据被存储在 store state 对象的`namespace`空间上，例如：

```js
@connect(
  ({ TicTacToe }) => {
    return { ...TicTacToe };
  },
  {
    ...ticTacToeModel.actions
  }
)
```
