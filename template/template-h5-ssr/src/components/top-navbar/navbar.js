import React, { PureComponent } from "react";
import { Flex, NavBar } from "@geetemp/gee-ui-mobile";
import CustomIcon from "components/custom-icon/custom-icon";
import "./navbar.scss";
const root = process.env.BROWSER ? require("../../client") : null;

export default class TopNavBar extends PureComponent {
  leftClick = () => {
    const {onLeftClick, noBack} = this.props;
    if (onLeftClick) {
      onLeftClick();
    }
    if (!noBack) {
      root.history.goBack();
    }
  }
  render() {
    const { title, className = "", extra, icon, onLeftClick, ...props } = this.props;
    return (
      <NavBar
        {...props}
        className={`top-nav-bar ${className}`}
        mode="light"
        icon={<div className="lefter-click" ><CustomIcon className="nav-left-icon" onClick={this.leftClick} type={icon ? icon : "iconleft"} /></div>}
        // onLeftClick={this.leftClick}
      >
        {title}
        {extra && <Flex align="center" className="right-extra">{extra}</Flex>}
      </NavBar>
    );
  }
}
