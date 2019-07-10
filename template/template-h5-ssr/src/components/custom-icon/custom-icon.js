//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js
import React, { PureComponent } from "react";
import "./custom-icon.scss";

const CustomIcon = ({ type, className = '', size = 'md', ...restProps }) => {
  return (
    <svg className={`am-icon am-icon-${type.substr(1)} am-icon-${size} ${className} custom-icon`} aria-hidden="true" {...restProps}>
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}
export default CustomIcon;