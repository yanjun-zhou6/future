import React from "react";
import { connect } from "react-redux";
import userModel from "models/userModel";

const { setUserInfo } = userModel.actions;

export default connect(
  null,
  { setUserInfo }
)(
  class extends React.Component {
    constructor(props) {
      super(props);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      this.props.setUserInfo(user);
    }

    render() {
      return this.props.children;
    }
  }
);
