import React from "react";
import { Tabs as AntTabs } from "antd";

export default class Tabs extends React.Component {
	render() {
		return <AntTabs {...this.props}  />;
	}
}
Tabs.TabPane = AntTabs.TabPane;