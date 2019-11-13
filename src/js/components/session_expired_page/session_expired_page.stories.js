import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import storeFunc from "../../redux_base/store";
import SessionExpiredPage from "./index";

const { store } = storeFunc();

export const apiMock = story => {
  const mock = new MockAdapter(axios);
  mock.onGet(/.*\/users\/.+\/resend-invite/).reply(request => {
    return [200, { ok: true, data: {} }];
  });
  return story();
};

storiesOf("SessionExpiredPage", module)
  .addDecorator(apiMock)
  .add("default", () => (
    <Provider store={store}>
      <SessionExpiredPage />
    </Provider>
  ));
