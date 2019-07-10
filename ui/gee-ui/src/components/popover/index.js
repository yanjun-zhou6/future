import React from "react";
import { Popover as AntPopover } from "antd";

export default class Popover extends React.Component {
	render() {
		return <AntPopover {...this.props} />;
	}
}
