import React, { PureComponent } from "react";
import * as Sentry from "@sentry/browser";

import Container from "../../components/container";
import Button from "../../components/button";
import { qsParse } from "../../utils/misc";
import NavWrapper from "../shared/nav_wrapper";

import "./error.scss";

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
          <Button
            className="provide-feedback__button"
            color="warning"
            fullWidth={false}
            uppercase={true}
            onClick={() => {
              throw new Error("User Feedback Button Press");
            }}
          >
            Provide Feedback
          </Button>
        </Container>
      </NavWrapper>
    );
  }
}

export default ErrorContainer;
