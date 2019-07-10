import React from "react";
import { BackTop as AntBackTop } from "antd";

export default class Tag extends React.Component {
	render() {
		const { className, ...props } = this.props;
		return <AntBackTop {...props} className={`gee-backtop ${className}`} />;
	}
}
