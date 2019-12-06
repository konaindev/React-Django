import React from "react";
import { connect } from "react-redux";

class TitleGate extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.title = this.props.title || "Remarkably";
  }

  render() {
    return this.props.children;
  }
}

const mapState = state => ({
  title: state.pageMeta.title
});
export default connect(mapState)(TitleGate);
