import renderer from "react-test-renderer";
import { SectionHeader } from "./index";

const props = {
  title: "Test Section"
};

describe("SectionHeader", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SectionHeader {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders default mode", () => {
    let wrapper = shallow(<SectionHeader {...props} />);
    const titleEl = wrapper.find("p.section-header__title");
    expect(titleEl).toHaveText(props.title);
  });

  it("renders with small margin", () => {
    let wrapper = shallow(<SectionHeader {...props} smallMarginTop />);
    expect(wrapper).toHaveClassName("section-header--mt-sm");
  });

  it("renders with right-side content", () => {
    const rightSideText = "Right-Side Content";
    let wrapper = shallow(
      <SectionHeader {...props}>{rightSideText}</SectionHeader>
    );
    const extraEl = wrapper.find(".section-header__extra");
    expect(extraEl).toHaveLength(1);
    expect(extraEl).toHaveText(rightSideText);
  });
});
