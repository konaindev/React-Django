import React from "react";
import { connect } from "redux-redux";
import { withRouter } from "react-router-dom";

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
export default withRouter(connect(x => x)(TitleGate));
