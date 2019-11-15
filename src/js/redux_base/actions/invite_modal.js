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
  changeRole: (role, property, member) => ({
    type: "API_INVITE_MODAL_CHANGE_ROLE",
    data: { role, property_id: property.property_id, member_id: member.user_id }
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
