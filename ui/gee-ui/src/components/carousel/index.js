import React from "react";

import { Carousel as AntCarousel } from "antd";

export default class Carousel extends React.Component {
	render() {
		return <AntCarousel {...this.props} />;
	}
}
