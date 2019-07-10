import React from "react";
import { Menu as AntMenu } from "antd";

export default class Menu extends React.Component {
	render() {
		return <AntMenu {...this.props} ></AntMenu>;
	}
}

Menu.Item = AntMenu.Item;