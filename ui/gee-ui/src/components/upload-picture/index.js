import React from "react";
import { Upload as AntUpload, Icon as AntIcon } from "antd";

export default class UploadPicture extends React.Component {
	state = {
		maxFileSize: this.props.maxFileSize ? this.props.maxFileSize : 2,
		fileList: this.props.value instanceof Array ? this.props.value : []
	};

	/**
	 * 处理图片更新
	 * @param e
	 */

	handleChange = e => {
		let fileList = this.handleUpload(e);
		this.props.onChange(fileList);
	};

	/**
	 * 处理更新
	 * @param e
	 * @returns {*}
	 */

	handleUpload = e => {
		let fileList = e.fileList.map(file => {
			if (file.response) {
				if (file.response.success) {
					console.log("上传成功");
					return this.filter(file);
				}
			}
			return file;
		});
		this.setState({ fileList: fileList });
		return fileList;
	};

	/**
	 * 过滤返回的数据
	 * @param file
	 */

	filter = file => {
		const { name, response, uid, status } = file;
		return { name, url: response.data, uid, status };
	};

	/**
	 * 上传之前的验证
	 */

	beforeUpload = file => {
		const maxFileSize = this.state.maxFileSize;
		if (maxFileSize) {
			const isLtMax = file.size / 1024 / 1024 < maxFileSize;
			if (!isLtMax) {
				alert("图片太大了");
			}
			return isLtMax;
		}
	};

	render() {
		const {
			action,
			iconName,
			className,
			maxFileSize,
			showUploadList = true
		} = this.props;
		let fileList = this.state.fileList;
		const uploadButton = (
			<div className="upload-des">
				<AntIcon type={iconName ? iconName : "plus"} />
				<div className="ant-upload-text">
					{maxFileSize ? (
						<span>
							点击上传图片
							<br />
							支持文件小于
							{maxFileSize}M
						</span>
					) : null}
				</div>
			</div>
		);

		const props = {
			action: action,
			fileList: fileList,
			headers: { "X-Requested-With": null },
			// accept: "image/*",
			accept: "image/jpg,image/jpeg,image/png,image/bmp",
			onChange: this.handleChange,
			beforeUpload: this.beforeUpload,
			listType: "picture-card",
			showUploadList: showUploadList
		};

		return (
			<div className={`gee-upload ${className} clear`}>
				<AntUpload {...props}>
					{fileList.length ? (
						<img src={fileList[0]} alt="avatar" />
					) : (
						uploadButton
					)}
				</AntUpload>
			</div>
		);
	}
}
