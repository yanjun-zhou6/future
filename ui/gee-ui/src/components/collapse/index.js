import React from "react";
import { Collapse as AntCollapse} from "antd";

export default class Collapse extends React.Component {
	render() {
		return <AntCollapse {...this.props} className="gee-collapse" />;
	}
}

Collapse.Panel = AntCollapse.Panel;