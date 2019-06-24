import React from "react";

import { asyncLoad } from "@geetemp/nut";

export default [
  {
    path: "/",
    exact: true,
    component: asyncLoad({
      loader: () => import("./Home"), // required
      placeholder: () => <div>...LOADING...</div> // this is optional, just returns null by default
    })
  },
  {
    path: "/about",
    exact: true,
    component: asyncLoad({
      loader: () => import("./About"), // required
      placeholder: () => <div>...LOADING...</div> // this is optional, just returns null by default
    })
  }
];
