import React from "react";
import { connect } from "react-redux";

import Loader from "../../components/loader";

const LoaderContainer = props => <Loader {...props} />;

const mapState = state => ({
  isShow: state.network.isFetching
});

export default connect(mapState)(LoaderContainer);
