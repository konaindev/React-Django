import React, { PureComponent } from "react";
import { connect } from "react-redux";

import Container from "../../components/container";
import { qsParse } from "../../utils/misc";

class ErrorContainer extends PureComponent {
  render() {
    const { search } = this.props.location;
    const { code = "", title = "", description = "" } = qsParse(search);

    return (
      <Container>
        <div style={{ paddingTop: "4rem" }}>
          <h3>
            {code} {title}
          </h3>
          <p style={{ marginTop: "1rem" }}>{description}</p>
        </div>
      </Container>
    );
  }
}

const mapState = ({}) => ({});

export default connect(mapState)(ErrorContainer);
