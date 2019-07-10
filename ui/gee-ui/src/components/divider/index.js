import React from "react";
import { Divider as AntDivider } from "antd";

export default class Divider extends React.Component {
	render() {
		return <AntDivider {...this.props} ></AntDivider>;
	}
}
