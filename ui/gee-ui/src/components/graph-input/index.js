import React from "react";
import { Input as AntInput} from "antd";
import "./style/index.less";

/**
 * 图形验证码文本框
 * @author common
 */
export default class GraphInput extends React.Component {
	state = {
		graphUrl: this.props.url
	};

	onGetGraphcode = () => {
		this.setState({
			graphUrl: `${this.props.url}?timestamp=${new Date().getTime()}`
		});
	};

	render() {
		const { icon, className, ...props } = this.props;
		const { graphUrl } = this.state;
		return (
			<div
				className={`gee-graph-input ${className ? className : ""} ${
					icon ? "has-icon" : ""
				}`}
			>
				{icon ? <div className="gee-graph-icon">{icon}</div> : null}
				<AntInput {...props} />
				<div onClick={this.onGetGraphcode} className="gee-graph-button">
					<img src={graphUrl} alt="图形验证码" />
				</div>
			</div>
		);
	}
}
