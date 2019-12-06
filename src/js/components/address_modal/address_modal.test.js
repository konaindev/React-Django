import renderer from "react-test-renderer";

import AddressModal from "./index";
import { createStore } from "redux";
import { Provider } from "react-redux";
import props from "./props";

jest.mock("react-responsive-modal", () => "Modal");

const _ = x => createStore(() => ({ addressModal: x, general: {} }));

describe("AddressModal", () => {
  it("renders AddressModal correctly", () => {
    const tree = renderer
      .create(
        <Provider store={_(props)}>
          <AddressModal />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
