import React from "react";
import { List as AntList } from "antd";

export default class List extends React.Component {
	render() {
		return <AntList {...this.props} className="gee-list" />;
	}
}
List.Item=AntList.Item;
List.Item.Meta=AntList.Item.Meta;