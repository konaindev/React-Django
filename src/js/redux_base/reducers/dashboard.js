const initialState = {
  fetchingProperties: true
};

const reducer = (state = initialState, action) => {
  let newState = {};

  switch (action.type) {
    case "DASHBOARD_UPDATE_STORE":
      return {
        ...state,
        ...action.payload
      };
    case "AJAX_DASHBOARD_PROPERTIES_REQUEST":
      return {
        ...state,
        fetchingProperties: true
      };
    case "AJAX_DASHBOARD_PROPERTIES_SUCCESS":
      return {
        ...state,
        ...action.payload,
        fetchingProperties: false
      };
    case "AJAX_DASHBOARD_PROPERTIES_FAILURE":
      return {
        ...state,
        fetchingProperties: false
      };
    case "GENERAL_REMOVE_MEMBER_COMPLETE":
      const properties = replaceObjectInArray(
        [...state.properties],
        action.property,
        "property_id"
      );
      const selectedProperties = replaceObjectInArray(
        [...state.selectedProperties],
        action.property,
        "property_id"
      );
      newState = {
        ...state,
        properties,
        selectedProperties
      };
      break;
    case "GENERAL_INVITE_MEMBER_COMPLETE":
      const propertiesObj = {};
      if (state.properties) {
        state.properties.forEach(p => {
          propertiesObj[p.property_id] = p;
        });
        action.properties.forEach(p => {
          propertiesObj[p.property_id] = {
            ...propertiesObj[p.property_id],
            ...p
          };
        });
        const properties = state.properties.map(
          p => propertiesObj[p.property_id]
        );
        newState = {
          ...state,
          properties,
          selectedProperties: []
        };
      } else {
        newState = { ...state };
      }
      break;
    default:
      newState = state;
  }
  return newState;
};

export default reducer;

function replaceObjectInArray(target, data, key) {
  const index = target.findIndex(t => t[key] === data[key]);
  if (index === -1) {
    return target;
  }
  target[index] = { ...target[index], ...data };
  return target;
}
