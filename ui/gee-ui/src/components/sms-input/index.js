import React from "react";
import { Input as AntInput } from "antd";
import "./style/index.less";

/**
 * 短信验证码文本框
 * @author common
 */
export default class SmsInput extends React.Component {
	state = {
		seconds: this.props.seconds || 60,
		countStatus: false
	};

	onGetAuthcode = () => {
		const { getAuthCodeReq, seconds } = this.props;
		const maxSeconds = seconds || 60;
		if (!getAuthCodeReq || typeof getAuthCodeReq !== "function")
			throw new Error(
				"have to provide getAuthCodeReq prop to SmsInput component"
			);
		if (this.timer) return;
		getAuthCodeReq()
			.then(() => {
				//设置倒计时状态为true
				this.setState({ countStatus: true });
				this.timer = setInterval(() => {
					this.setState(state => {
						return { seconds: state.seconds - 1 };
					});
					const { seconds } = this.state;
					if (seconds === 0) {
						clearInterval(this.timer);
						this.timer = null;
						this.setState({ seconds: maxSeconds, countStatus: false });
					}
				}, 1000);
			})
			.catch(e => {});
	};

	render() {
		const {
			icon,
			authCodeText,
			className,
			getAuthCodeReq,
			...props
		} = this.props;
		const { countStatus, seconds } = this.state;
		return (
			<div
				className={`gee-sms-input ${className ? className : ""} ${
					icon ? "has-icon" : ""
				}`}
			>
				{icon ? <div className="gee-sms-icon">{icon}</div> : null}
				<AntInput {...props} />
				<span
					onClick={this.onGetAuthcode}
					className={`gee-sms-button ${countStatus ? "counting" : ""}`}
				>
					{countStatus ? `${seconds}后重新获取` : authCodeText || "获取验证码"}
				</span>
			</div>
		);
	}
}
