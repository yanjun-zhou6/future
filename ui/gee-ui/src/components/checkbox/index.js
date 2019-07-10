import React from "react";
import { Checkbox  as AntCheckbox } from "antd";

export default class Checkbox extends React.Component {
	render() {
		return <AntCheckbox {...this.props}  />;
	}
}
Checkbox.Group = AntCheckbox.Group;