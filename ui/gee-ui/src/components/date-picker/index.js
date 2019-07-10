import React from "react";
import { DatePicker as AntDatePicker } from "antd";

export default class DatePicker extends React.Component {
	render() {
		return <AntDatePicker {...this.props}  />;
	}
}

DatePicker.MonthPicker = AntDatePicker.MonthPicker;
DatePicker.RangePicker = AntDatePicker.RangePicker;
DatePicker.WeekPicker = AntDatePicker.WeekPicker;