const intialState = { properties: [] };

export default (state = intialState, action) => {
  let newState = {};
  switch (action.type) {
    case "SET_ACCOUNT_REPORTS_PROPERTIES": {
      const properties = [...action.properties];
      newState = { ...state, properties };
      break;
    }
    default:
      newState = { ...state };
  }
  return newState;
};
