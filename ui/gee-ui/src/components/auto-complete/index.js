import React from "react";
import { AutoComplete as AntAutoComplete } from "antd";
import "./style/index.less";

export default class AutoComplete extends React.Component {
	render() {
		const { icon, className, ...props } = this.props;
		return (
			<div
				className={`gee-auto-complete ${className ? className : ""} ${
					icon ? "has-icon" : ""
				}`}
			>
				{icon ? <div className="gee-auto-complete-icon">{icon}</div> : null}
				<AntAutoComplete {...this.props} />
			</div>
		);
	}
}
