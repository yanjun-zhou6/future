import React from "react";
import { Steps as AntSteps } from "antd";

export default class Steps extends React.Component {
	render() {
		return <AntSteps {...this.props} />;
	}
}

Steps.Step  = AntSteps.Step;