import { mount, shallow } from "enzyme";

import FunnelPerformanceAnalysis from "./index";
import props from "./FunnelProps";

describe("FunnelPerformanceAnalysis", () => {
  it("renders monthly/weekly view correctly", () => {
    let wrapper = mount(<FunnelPerformanceAnalysis {...props} />);

    // two tables
    expect(wrapper.find("p[children='Volume of Activity']").exists()).toBe(
      true
    );
    expect(wrapper.find("p[children='Conversion Rate']").exists()).toBe(true);
    expect(wrapper.find("div.analysis__table--monthly").length).toBe(2);

    // first table
    let firstTable = wrapper.find("div.analysis__table--monthly").at(0);
    expect(firstTable.find(".rt-tr-group").length).toBe(5); // 5 rows
    expect(firstTable.find(".cell-month").length).toBe(60); // 60 cells

    // second table
    let secondTable = wrapper.find("div.analysis__table--monthly").at(1);
    expect(secondTable.find(".rt-tr-group").length).toBe(4); // 4 rows
    expect(secondTable.find(".cell-month").length).toBe(48); // 48 cells

    // weekly view
    wrapper.setState({ viewMode: "weekly" });

    // first table
    firstTable = wrapper.find("div.analysis__table--weekly").at(0);
    expect(firstTable.find(".cell-week").length).toBe(60); // 60 cells

    // second table
    secondTable = wrapper.find("div.analysis__table--weekly").at(1);
    expect(secondTable.find(".cell-week").length).toBe(48); // 48 cells
  });

  it("switches monthly/weekly view properly", () => {
    let wrapper = mount(<FunnelPerformanceAnalysis {...props} />);
    let monthlyViewButton = wrapper.find("button[children='Monthly']");
    let weeklyViewButton = wrapper.find("button[children='Weekly']");
    expect(monthlyViewButton.hasClass("button--selected")).toBe(true);
    weeklyViewButton.simulate("click");
    weeklyViewButton = wrapper.find("button[children='Weekly']");
    expect(weeklyViewButton.hasClass("button--selected")).toBe(true);
  });

  it("renders with [] correctly", () => {
    const tree = shallow(<FunnelPerformanceAnalysis funnel_history={[]} />);
    expect(tree).toMatchSnapshot();
  });

  it("renders with null correctly", () => {
    const tree = shallow(<FunnelPerformanceAnalysis funnel_history={null} />);
    expect(tree).toMatchSnapshot();
  });
});
