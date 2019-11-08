const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INVITE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true
      };
    case "INVITE_MODAL_HIDE":
    case "AJAX_POST_DASHBOARD_ADD_MEMBER_SUCCESS":
      return {
        ...state,
        isOpen: false
      };
    case "INVITE_MODAL_REMOVE_MODAL_SHOW":
      return {
        ...state,
        removeModalIsOpen: true,
        remove: {
          member: action.member,
          property: action.property
        }
      };
    case "INVITE_MODAL_REMOVE_MODAL_HIDE":
    case "AJAX_DASHBOARD_REMOVE_MEMBER_SUCCESS":
      return {
        ...state,
        removeModalIsOpen: false
      };
    default:
      return state;
  }
};

export default reducer;
