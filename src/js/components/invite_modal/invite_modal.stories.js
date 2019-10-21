import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import { props as userProps } from "../user_icon_list/props";
import storeFunc from "../../state/store";

import InviteModal from "./index";
import { props, multiProps } from "./props";

const { store } = storeFunc();
const withProvider = story => <Provider store={store}>{story()}</Provider>;

export const apiMock = story => {
  const mock = new MockAdapter(axios);
  mock.onPost(`${process.env.BASE_URL}/projects/members/`).reply(request => {
    const value = JSON.parse(request.data).value;
    const members = userProps.users
      .filter(
        m =>
          m.account_name.toLowerCase().includes(value) ||
          m.email.toLowerCase().includes(value)
      )
      .slice(0, 5);
    return [200, { members }];
  });
  mock.onPost(/.*\/projects\/.+\/remove-member\//).reply(request => {
    const { project, member } = JSON.parse(request.data);
    const newProject = {
      ...project,
      members: project.members.filter(m => m.user_id !== member.user_id)
    };
    return [200, { project: newProject }];
  });
  mock
    .onPost(`${process.env.BASE_URL}/projects/add-members/`)
    .reply(request => {
      const { projects, members } = JSON.parse(request.data);
      projects.forEach(p => {
        p.members = [...p.members, ...members];
      });
      return [200, { projects }];
    });
  return story();
};

storiesOf("InviteModal", module)
  .addDecorator(apiMock)
  .addDecorator(withProvider)
  .add("default", () => {
    store.getState().general = {
      properties: props.properties,
      selectedProperties: props.properties
    };
    store.dispatch({
      type: "INVITE_MODAL_SHOW"
    });
    return <InviteModal />;
  })
  .add("Multiple properties", () => {
    store.getState().general = {
      properties: multiProps.properties,
      selectedProperties: multiProps.properties
    };
    store.dispatch({
      type: "INVITE_MODAL_SHOW"
    });
    return <InviteModal />;
  });
