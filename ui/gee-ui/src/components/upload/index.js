import React from "react";
import { Upload as AntUpload } from "antd";

export default class Upload extends React.Component {
	render() {
		return <AntUpload {...this.props} />;
	}
}
