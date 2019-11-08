import { createAjaxAction } from "./helpers";

const actions = {
  open: {
    type: "INVITE_MODAL_SHOW"
  },
  close: {
    type: "INVITE_MODAL_HIDE"
  },
  openRemoveModal: (property, member) => ({
    type: "INVITE_MODAL_REMOVE_MODAL_SHOW",
    property,
    member
  }),
  closeRemoveModal: {
    type: "INVITE_MODAL_REMOVE_MODAL_HIDE"
  },
  getUsers: (value, callback) => ({
    type: "API_INVITE_MODAL_GET_USERS",
    data: { value },
    callback
  }),
  removeMember: (project, member) => ({
    type: "AJAX_DASHBOARD_REMOVE_MEMBER",
    data: { project, member }
  }),
  addMembers: createAjaxAction(
    "AJAX_POST_DASHBOARD_ADD_MEMBER",
    "/projects/add-members/"
  ),
  resend: (hash, callback) => ({
    type: "API_INVITE_RESEND",
    hash,
    callback
  }),
  updateStore: payload => ({
    type: "DASHBOARD_UPDATE_STORE",
    payload
  })
};

export default actions;
