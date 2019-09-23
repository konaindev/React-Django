import React from "react";
import { Link } from "react-router-dom";
import "./remarkably_logo.scss";

export default function RemarkablyLogo(props) {
  return (
    <Link to="/dashboard">
      <div className="remarkably-logo"> </div>
    </Link>
  );
}
