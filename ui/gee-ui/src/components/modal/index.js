import React from "react";
import { Modal as AntModal } from "antd";
import "./style/index.less";

export default class Modal extends React.Component {
	render() {
		return (
			<AntModal
				{...this.props}
				className={`gee-modal ${this.props.className}`}
			/>
		);
	}
}

Modal.confirm = AntModal.confirm;
Modal.success = AntModal.success;
Modal.error = AntModal.error;
