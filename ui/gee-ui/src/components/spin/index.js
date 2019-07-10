import React from "react";
import { Spin as AntSpin } from "antd";

export default class Spin extends React.Component {
	render() {
		return <AntSpin {...this.props}  />;
	}
}