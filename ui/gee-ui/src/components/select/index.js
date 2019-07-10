import React from "react";
import { Select as AntSelect } from "antd";
import "./style/index.less";

export default class Select extends React.Component {
	render() {
		const {icon, className, ...props} = this.props;
		return (
			<div className={`gee-select ${icon ? "has-icon" : ""}`}>
				{icon &&
					<span className={`gee-icon icon-${icon}`}></span>
				}
				<AntSelect className={`${icon ? "icon-select" : ""} ${className}`} {...props} />
			</div>
		);
	}
}

Select.Option = AntSelect.Option;
