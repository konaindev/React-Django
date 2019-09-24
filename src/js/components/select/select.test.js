import React from "react";
import renderer from "react-test-renderer";

import Select, { SelectSearch } from "./index";
import { props, propsScroll } from "./props";
import { MultiValueComponents } from "./select_components";

describe("Select", () => {
  it("render select", () => {
    const tree = renderer.create(<Select {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render highlight select", () => {
    const tree = renderer
      .create(<Select theme="highlight" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render gray select", () => {
    const tree = renderer.create(<Select theme="gray" {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render transparent select", () => {
    const tree = renderer
      .create(<Select theme="transparent" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render multi value select", () => {
    const tree = renderer
      .create(
        <Select
          theme="transparent"
          options={propsScroll.options}
          defaultValue={propsScroll.options}
          styles={{
            valueContainer: provided => ({ ...provided, height: "42px" })
          }}
          isMulti={true}
          components={{ ...MultiValueComponents }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render select search", () => {
    const tree = renderer.create(<SelectSearch {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render highlight select search", () => {
    const tree = renderer
      .create(<SelectSearch theme="highlight" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("render transparent select search", () => {
    const tree = renderer
      .create(<SelectSearch theme="transparent" {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
