import React from "react";
import ReactGa from "react-ga";
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    ReactGa.initialize(process.env.GA_ID || "MISSING GA ID");
  }
  render() {
    return this.props.children;
  }
}
