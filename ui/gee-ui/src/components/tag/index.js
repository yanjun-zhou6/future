import React from "react";
import { Tag as AntTag } from "antd";

export default class Tag extends React.Component {
	render() {
		const {className} = this.props;
		return <AntTag {...this.props} className={`gee-tag ${className}`} />;
	}
}
