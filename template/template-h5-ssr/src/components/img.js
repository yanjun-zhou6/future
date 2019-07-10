import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Flex, Menu, Accordion, Icon } from "@geetemp/gee-ui-mobile";

export default class ImgContainer extends Component {

  render() {
    const {src, className, children, ...props} = this.props;
    return (
      <div className={`img-container ${className}`}>
        <img src={src} {...props} />
        {children}
      </div>
    );
  }
}
