const initialState = {
  fetchingProperties: true
};

const reducer = (state = initialState, action) => {
  let properties, selectedProperties;

  switch (action.type) {
    case "DASHBOARD_UPDATE_STORE":
      return {
        ...state,
        ...action.payload
      };
    case "AJAX_GET_DASHBOARD_PROPERTIES_REQUEST":
      return {
        ...state,
        fetchingProperties: true
      };
    case "AJAX_GET_DASHBOARD_PROPERTIES_SUCCESS":
      return {
        ...state,
        ...action.payload,
        fetchingProperties: false
      };
    case "AJAX_GET_DASHBOARD_PROPERTIES_FAILURE":
      return {
        ...state,
        fetchingProperties: false
      };
    case "GENERAL_REMOVE_MEMBER_COMPLETE":
      properties = replaceObjectInArray(
        [...state.properties],
        action.property,
        "property_id"
      );
      selectedProperties = replaceObjectInArray(
        [...state.selectedProperties],
        action.property,
        "property_id"
      );
      return {
        ...state,
        properties,
        selectedProperties
      };
    case "GENERAL_INVITE_MEMBER_COMPLETE":
      if (!state.properties) {
        return state;
      }

      let propertiesObj = {};
      state.properties.forEach(p => {
        propertiesObj[p.property_id] = p;
      });
      action.properties.forEach(p => {
        propertiesObj[p.property_id] = {
          ...propertiesObj[p.property_id],
          ...p
        };
      });
      properties = state.properties.map(p => propertiesObj[p.property_id]);

      return {
        ...state,
        properties,
        selectedProperties: []
      };
    default:
      return state;
  }
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
