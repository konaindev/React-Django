import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { uiStrings } from "../../redux_base/actions";

class UIStringsGate extends React.PureComponent {
  static propTypes = {
    version: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.updateStrings();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language && !this.version) {
      this.updateStrings();
    }
  }

  get version() {
    return this.props.version[this.props.language];
  }

  updateStrings = () => {
    this.props.dispatch(uiStrings.fetch(this.version, this.props.language));
  };

  render() {
    return this.props.children;
  }
}

const mapState = state => ({
  version: state.uiStrings.version,
  language: state.uiStrings.language
});

export default connect(mapState)(UIStringsGate);
