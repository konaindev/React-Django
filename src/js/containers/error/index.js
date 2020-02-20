import React, { PureComponent } from "react";
import { connect } from "react-redux";

import Container from "../../components/container";
import { qsParse } from "../../utils/misc";
import NavWrapper from "../shared/nav_wrapper";

class ErrorContainer extends PureComponent {
  render() {
    const { search } = this.props.location;
    const { code = "", title = "", description = "" } = qsParse(search);

    return (
      <NavWrapper>
        <Container>
          <div style={{ paddingTop: "4rem" }}>
            <h3>
              {code} {title}
            </h3>
            <p style={{ marginTop: "1rem" }}>{description}</p>
          </div>
        </Container>
      </NavWrapper>
    );
  }
}

export default ErrorContainer;
