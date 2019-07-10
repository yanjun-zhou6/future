import React from "react";
import { Input as AntInput } from "antd";

export default class Input extends React.Component {
	render() {
		return <AntInput {...this.props} />;
	}
}

Input.TextArea = AntInput.TextArea;
Input.Search = AntInput.Search;
// Input.Password = AntInput.Password;
