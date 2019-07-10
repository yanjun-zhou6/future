import React from "react";
import { Radio as AntRadio } from "antd";

export default class Radio extends React.Component {
	render() {
		return <AntRadio {...this.props} />;
	}
}

Radio.Group  = AntRadio.Group;
Radio.Button  = AntRadio.Button;