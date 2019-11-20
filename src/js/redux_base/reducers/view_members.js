const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "VIEW_MEMBERS_MODAL_SHOW":
      return {
        ...state,
        isOpen: true
      };
    case "VIEW_MEMBERS_MODAL_HIDE":
      return {
        ...state,
        isOpen: false
      };
    default:
      return state;
  }
};

export default reducer;
