import React from "react";
import { Row as AntRow } from "antd";

export default class Row extends React.Component {
	render() {
		const {className} = this.props;
		return <AntRow {...this.props} className={`gee-row ${className}`} />;
	}
}
