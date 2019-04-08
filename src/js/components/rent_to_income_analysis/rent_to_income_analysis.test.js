import renderer from "react-test-renderer";
import RentToIncomeAnalysis from "./index";
import { props_small, props_large } from "./rent_to_income_analysis.stories";

describe("RentToIncomeAnalysis", () => {
  it("renders in small mode correctly", () => {
    const tree = renderer.create(<RentToIncomeAnalysis {...props_small} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders in large mode correctly", () => {
    const tree = renderer.create(<RentToIncomeAnalysis {...props_large} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
