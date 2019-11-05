import React from "react";

// inject a separate style tag for global styles in storybook
import "../../css/main.scss";

import Container from "../components/container";
// Storybook page container to put component centered
export const StorybookContainer = ({ children }) => (
  <div style={{ margin: "1rem auto" }}>
    <Container>{children}</Container>
  </div>
);

export default StorybookContainer;
