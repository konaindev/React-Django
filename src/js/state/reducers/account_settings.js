const intialState = { properties: [], hasNextPage: false, pageNum: 1 };

export default (state = intialState, action) => {
  let newState = {};
  switch (action.type) {
    case "SET_ACCOUNT_REPORTS_PROPERTIES": {
      const { properties, has_next_page, page_num } = action.data;
      let newProperties;
      if (page_num > 1) {
        newProperties = [...state.properties, ...properties];
      } else {
        newProperties = [...properties];
      }
      newState = {
        ...state,
        properties: newProperties,
        hasNextPage: has_next_page,
        pageNum: page_num
      };
      break;
    }
    case "CLEAR_ACCOUNT_REPORTS_PROPERTIES": {
      newState = { ...state, ...intialState };
      break;
    }
    default:
      newState = { ...state };
  }
  return newState;
};
