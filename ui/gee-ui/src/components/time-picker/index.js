import React from "react";
import { TimePicker as AntTimePicker } from "antd";

export default class TimePicker extends React.Component {
	render() {
		return <AntTimePicker {...this.props} />;
	}
}
