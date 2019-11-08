const initialState = {
  fetching: true,
  table_data: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "PORTFOLIO_UPDATE_STORE":
      return {
        ...state,
        ...action.payload
      };
    case "AJAX_GET_PORTFOLIO_GROUPS_REQUEST":
      return {
        ...state,
        fetching: true
      };
    case "AJAX_GET_PORTFOLIO_GROUPS_SUCCESS":
      return {
        ...state,
        ...action.payload,
        fetching: false
      };
    case "AJAX_GET_PORTFOLIO_GROUPS_FAILURE":
      return {
        ...state,
        fetching: false
      };
    default:
      return state;
  }
};

export default reducer;
