import React from "react";
import { Pagination as AntPagination } from "antd";

export default class Pagination extends React.Component {
	render() {
		return <AntPagination {...this.props} />;
	}
}