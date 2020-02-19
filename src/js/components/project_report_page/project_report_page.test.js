import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import ProjectReportPage from "./index";
import { performanceProps, baselineProps } from "./props";

const _ = () => createStore(() => ({}));

describe("ProjectReportPage", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => 0.12345);
  });

  it("renders performance report", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <ProjectReportPage {...performanceProps} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders baseline report", () => {
    const tree = renderer
      .create(
        <Provider store={_()}>
          <MemoryRouter>
            <ProjectReportPage {...baselineProps} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
