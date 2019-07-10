import React from "react";
import { Timeline as AntTimeline } from "antd";

export default class Timeline extends React.Component {
	render() {
		return <AntTimeline {...this.props}  />;
	}
}

Timeline.Item = AntTimeline.Item;