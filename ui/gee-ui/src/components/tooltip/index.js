import React from "react";
import { Tooltip as AntTooltip } from "antd";

export default class Tooltip extends React.Component {
	render() {
		return <AntTooltip {...this.props} />;
	}
}
