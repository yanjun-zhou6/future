import React, { Component } from "react";

class About extends Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { about: "welcome to about" };
  }

  render() {
    const { about } = this.props;
    return <div>{about}</div>;
  }
}

export default About;
