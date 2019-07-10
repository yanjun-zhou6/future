import React from "react";
import { Cascader as AntCascader } from "antd";
import "./style/index.less";

export default class Cascader extends React.Component {
	antCascader = React.createRef();
	render() {
		const { icon, className, ...props } = this.props;
		return (
			<div
				className={`gee-cascader ${className ? className : ""} ${
					icon ? "has-icon" : ""
				}`}
			>
				{icon ? <div className="gee-cascader-icon">{icon}</div> : null}
				<AntCascader ref={this.antCascader} {...props} />
			</div>
		);
	}
}