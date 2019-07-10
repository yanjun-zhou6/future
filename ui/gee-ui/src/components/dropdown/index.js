import React from "react";
import { Dropdown as AntDropdown } from "antd";

export default class Dropdown extends React.Component {
	render() {
		return <AntDropdown {...this.props} />;
	}
}
