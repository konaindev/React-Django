import renderer from "react-test-renderer";

import DateRange from "./index";

describe("DateRange", () => {
  const RealDate = Date;

  function mockDate(date) {
    global.Date = class MockDate extends Date {
      constructor(...props) {
        super(...props);
        if (!props.length) {
          return new Date(date);
        }
      }
    };
    global.Date.prototype = RealDate.prototype;
  }

  afterEach(() => {
    global.Date = RealDate;
  });

  it("renders correctly", () => {
    const tree = renderer.create(<DateRange onChange={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("renders opened", () => {
    mockDate("2019-06-24");
    const component = renderer.create(<DateRange onChange={() => {}} />);
    component.getInstance().showDayPicker();
    expect(component.toJSON()).toMatchSnapshot();
  });
  it("renders with dates", () => {
    const props = {
      startDate: new Date("2019-06-12"),
      endDate: new Date("2019-06-20"),
      onChange: () => {}
    };
    mockDate("2019-06-24");
    const component = renderer.create(<DateRange {...props} />);
    component.getInstance().showDayPicker();
    expect(component.toJSON()).toMatchSnapshot();
  });
});
