import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { MarketSizeMap } from "./index";
import {
  circleOnly,
  zipcodesOnly,
  circleWithZipcodes,
  polygonWithHole
} from "./props";

describe("MarketSizeMap", () => {
  it("renders circle-only mode correctly", () => {
    const tree = shallow(<MarketSizeMap {...circleOnly} />);
    const instance = tree.instance();
    expect(tree.debug()).toMatchSnapshot();
    expect(instance.isCircleMode).toBeTruthy();
    expect(instance.isPolygonMode).toBeFalsy();
    expect(instance.isCirclePolygonMode).toBeFalsy();
    expect(instance.uniqueZipCodes).toEqual([]);
    expect(instance.getRadiusInMeter()).toEqual(4988.954);
    expect(instance.renderZipcodeMarkers()).toEqual([]);
  });

  it("renders zipcodes-only mode correctly", () => {
    const tree = shallow(<MarketSizeMap {...zipcodesOnly} />);
    const instance = tree.instance();
    expect(tree.debug()).toMatchSnapshot();
    expect(instance.isCircleMode).toBeFalsy();
    expect(instance.isPolygonMode).toBeTruthy();
    expect(instance.isCirclePolygonMode).toBeFalsy();
    expect(instance.uniqueZipCodes.length).toEqual(3);
    expect(instance.renderZipcodeMarkers()).toMatchSnapshot();
  });

  it("renders circle-with-zipcodes mode correctly", () => {
    const tree = shallow(<MarketSizeMap {...circleWithZipcodes} />);
    const instance = tree.instance();
    expect(tree.debug()).toMatchSnapshot();
    expect(instance.isCircleMode).toBeTruthy();
    expect(instance.isPolygonMode).toBeTruthy();
    expect(instance.isCirclePolygonMode).toBeTruthy();
    expect(instance.uniqueZipCodes.length).toEqual(3);
    expect(instance.getRadiusInMeter()).toEqual(4988.954);
    expect(instance.renderZipcodeMarkers()).toMatchSnapshot();
  });

  it("renders polygon-with-hole map correctly", () => {
    const tree = shallow(<MarketSizeMap {...polygonWithHole} />);
    const instance = tree.instance();
    expect(tree.debug()).toMatchSnapshot();
    expect(instance.isCircleMode).toBeFalsy();
    expect(instance.isPolygonMode).toBeTruthy();
    expect(instance.isCirclePolygonMode).toBeFalsy();
    expect(instance.uniqueZipCodes.length).toEqual(1);
    expect(instance.renderZipcodeMarkers()).toMatchSnapshot();
  });
});
