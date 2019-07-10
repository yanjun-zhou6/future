import React from "react";
import { Button as AntButton } from "antd";

export default class Button extends React.Component {
	render() {
		const { className } = this.props;
		return <AntButton {...this.props} className={`gee-button ${className}`} />;
	}
}
