import { mount } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";

import SearchInput from "./index";
import { SearchWithSort } from "./search_with_sort";

describe("SearchInput", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SearchInput />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("close works", () => {
    const tree = mount(<SearchInput />);
    expect(tree.exists(".search-input-close")).toBe(false);

    const input = tree.find("input");
    input.instance().value = "Test";
    input.simulate("change");
    expect(tree.exists(".search-input-close")).toBe(true);
    expect(tree).toMatchSnapshot();

    tree.find("Close").simulate("click");
    expect(input.instance().value).toBe("");
  });
});

describe("SearchWithSort", () => {
  it("renders default", () => {
    const tree = renderer.create(<SearchWithSort />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders highlight", () => {
    const tree = renderer.create(<SearchWithSort theme="highlight" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders gray", () => {
    const tree = renderer.create(<SearchWithSort theme="gray" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("sort works", () => {
    const tree = mount(<SearchWithSort initialSort="asc" />);
    let sort = tree.find("Sort");
    expect(sort.hasClass("search-with-sort__button--asc")).toBe(true);
    expect(sort.hasClass("search-with-sort__button--desc")).toBe(false);

    sort.simulate("click");
    sort = tree.find("Sort");
    expect(sort.hasClass("search-with-sort__button--asc")).toBe(false);
    expect(sort.hasClass("search-with-sort__button--desc")).toBe(true);

    expect(tree).toMatchSnapshot();
  });
});
