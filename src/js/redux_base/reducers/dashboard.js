const initialState = {
  properties: [],
  selectedProperties: [],
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
    case "AJAX_DASHBOARD_REMOVE_MEMBER_SUCCESS":
    case "API_DASHBOARD_REMOVE_MEMBER":
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
    case "AJAX_POST_DASHBOARD_ADD_MEMBER_SUCCESS":
    case "AJAX_POST_INVITE_MODAL_ADD_MEMBER_SUCCESS":
      if (!state.properties.length) {
        return state;
      }

      let propertiesObj = {};
      state.properties.forEach(p => {
        propertiesObj[p.property_id] = p;
      });
      action.payload.projects.forEach(p => {
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
    case "AJAX_DASHBOARD_UPDATE_MEMBER_SUCCESS":
      if (!state.properties.length) {
        return state;
      }
      const { property_id, members } = action.data;
      const index = state.properties.findIndex(
        p => p.property_id === property_id
      );
      properties = [...state.properties];
      properties[index].members = members;
      return {
        ...state,
        properties
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
