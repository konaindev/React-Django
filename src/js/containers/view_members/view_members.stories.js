import React from "react";
import { storiesOf } from "@storybook/react";
import { Provider } from "react-redux";

import { props as userProps } from "../../components/user_icon_list/props";
import storeFunc from "../../redux_base/store";

import { ViewMembersReport } from "./index";

const { store } = storeFunc();
const withProvider = story => <Provider store={store}>{story()}</Provider>;

storiesOf("ViewMembers", module)
  .addDecorator(withProvider)
  .add("default", () => {
    store.getState().projectReports = {
      project: {
        name: "Test Project",
        members: userProps.users.slice(0, 7)
      }
    };
    store.getState().viewMembersModal = {
      isOpen: true
    };
    return <ViewMembersReport />;
  });
