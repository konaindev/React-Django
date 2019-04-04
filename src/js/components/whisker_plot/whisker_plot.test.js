import renderer from "react-test-renderer";
import WhiskerPlot from "./index";

describe("WhiskerPlot", () => {
  beforeEach(() => {
    Math.random = jest.fn(() => "12345");
  });

  it("renders upward plot correctly", () => {
    const props = {
      series: [1, 2, 3, 4, 5, 4, 3, 3, 1],
      direction: "up"
    };

    const tree = renderer.create(<WhiskerPlot {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders downward plot correctly", () => {
    const props = {
      series: [3, 5, 2, 4, 5, 4, 1, 3, 1],
      direction: "down"
    };

    const tree = renderer.create(<WhiskerPlot {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
