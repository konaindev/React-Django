import React, { Component } from "react";

export default class ProjectPage extends Component {
  // TODO: define propTypes, maybe? -Dave

  render() {
    // TODO: actual rendering code goes here. -Dave
    return (
      <div className="page">
        <h1>Remarkably</h1>
        <p>This is ProjectPage.js</p>
        <p>
          All props: <pre>{JSON.stringify(this.props, null, "  ")}</pre>
        </p>
      </div>
    );
  }
}
