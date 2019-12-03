import React, { Component } from "react";
import AuthWrapper from "./auth_wrapper";
import NavWrapper from "./nav_wrapper";

const renderWrapper = (child, auth = true, nav = true) => {
  if (auth) {
    if (nav) {
      return (
        <AuthWrapper>
          <NavWrapper>{child}</NavWrapper>
        </AuthWrapper>
      );
    }
    return <AuthWrapper>{child}</AuthWrapper>;
  }
  return child;
};

export default renderWrapper;
