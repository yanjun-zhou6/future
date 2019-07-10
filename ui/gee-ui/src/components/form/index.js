import React from "react";
import { Form as AntForm } from "antd";

export default class Form extends React.Component {
	render() {
		return <AntForm {...this.props} />;
	}
}

Form.Item = AntForm.Item;
Form.create = AntForm.create;
Form.createFormField = AntForm.createFormField;
