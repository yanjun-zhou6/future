import React from "react";
import { Col as AntCol } from "antd";

export default class Col extends React.Component {
	render() {
		return <AntCol {...this.props} />;
	}
}
