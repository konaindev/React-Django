import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CreatePasswordView } from "../../components/create_password_view";
import { createPassword } from "../../redux_base/actions";
import renderWrapper from "../shared/base_container";

class CreatePasswordContainer extends PureComponent {
  componentDidMount() {
    this.hash = this.props.match.params.hash;
    this.props.dispatch(createPassword.getRules());
    console.log("COMPONENT MOUNTED");
  }

  getConfig() {
    return {
      auth: false,
      nav: false
    };
  }

  render() {
    if (this.props.rules) {
      return renderWrapper(
        <CreatePasswordView hash={this.hash} {...this.props} />,
        false,
        false
      );
    }
    return renderWrapper(<div>loading...</div>, false, false);
  }
}

const mapState = state => ({
  ...state.createPassword
});

export default withRouter(connect(mapState)(CreatePasswordContainer));
