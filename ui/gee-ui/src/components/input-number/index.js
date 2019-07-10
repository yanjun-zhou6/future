import React from "react";
import { InputNumber as AntInputNumber } from "antd";
import "./style/index.less";

export default class InputNumber extends React.Component {
	render() {
		const { icon, className, ...props } = this.props;
		return (
			<div
				className={`gee-input-number ${className ? className : ""} ${
					icon ? "has-icon" : ""
				}`}
			>
				{icon ? <div className="gee-input-number-icon">{icon}</div> : null}
				<AntInputNumber {...props} />
			</div>
		);
	}
}
