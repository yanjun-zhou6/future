import React from "react";
import { Avatar as AntAvatar } from "antd";

export default class Button extends React.Component {
	render() {
		const { className } = this.props;
		return <AntAvatar {...this.props} className={`gee-avatar ${className}`} />;
	}
}
