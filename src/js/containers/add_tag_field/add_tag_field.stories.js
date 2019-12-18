import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";

import { API_URL_PREFIX, URLS } from "../../redux_base/actions/helpers";
import storeFunc from "../../redux_base/store";

import AddTagField from "./index";
import props from "./props";

const { store } = storeFunc();
const withProvider = story => <Provider store={store}>{story()}</Provider>;

export const apiMock = story => {
  // Init state
  const projectReports = store.getState().projectReports;
  projectReports.project = props.project;
  // API mock
  const mock = new MockAdapter(axios);
  const public_id = props.project.public_id;
  const baseURL = `${API_URL_PREFIX}${URLS.project}/${public_id}`;
  mock.onPost(`${baseURL}/create-tag/`).reply(200, { custom_tags: [] });
  mock.onPost(`${baseURL}/remove-tag/`).reply(200, { custom_tags: [] });
  mock.onGet(/\/projects\/.*\/search-tags\/\?word=.*/).reply(request => {
    const word = request.url.match(/\?word=(.*)$/)[1];
    let tags;
    const suggestedTags = props.suggestedTags;
    if (word) {
      tags = [];
      for (let t of suggestedTags) {
        if (t.word.match(new RegExp(word, "i"))) {
          tags.push(t);
        }
      }
    } else {
      tags = [];
    }
    return [200, { tags }];
  });
  return story();
};

storiesOf("AddTagField", module)
  .addDecorator(apiMock)
  .addDecorator(withProvider)
  .add("default", () => <AddTagField />);
