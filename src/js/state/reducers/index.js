import _cloneDeep from "lodash/cloneDeep";
import { combineReducers } from "redux";

const initState = {
  tutorialView: {}
};

function replaceObjectInArray(target, data, key) {
  const index = target.findIndex(t => t[key] === data[key]);
  if (index === -1) {
    return target;
  }
  target[index] = { ...target[index], ...data };
  return target;
}

const dashboard = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case "GENERAL_SET_STATE": {
      newState = { ...action.newState };
      break;
    }
    case "GENERAL_UPDATE_STATE": {
      newState = { ...state, ...action.newState };
      break;
    }
    case "GENERAL_REMOVE_MEMBER_COMPLETE": {
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
    }
    case "GENERAL_INVITE_MEMBER_COMPLETE": {
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
    }
    default:
      newState = { ...state };
  }
  return newState;
};

const tutorial = (state = initState, action) => {
  let newState = {};
  switch (action.type) {
    case "TUTORIAL_SET_STATE": {
      newState = { ...state, tutorialView: action.newState };
      break;
    }
    default:
      newState = { ...state };
  }
  return newState;
};

const network = (state = { isFetching: false }, action) => {
  let newState = {};
  switch (action.type) {
    case "NETWORK_START_FETCH": {
      newState = { ...state, isFetching: true };
      break;
    }
    case "NETWORK_STOP_FETCH": {
      newState = { ...state, isFetching: false };
      break;
    }
    default:
      newState = { ...state };
  }
  return newState;
};

const createPassword = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case "CREATE_PASSWORD_SET_STATE": {
      newState = { ...state, ...action.newState };
      break;
    }
    case "CREATE_PASSWORD_REDIRECT": {
      window.location.replace(action.url);
      break;
    }
    default:
      newState = { ...state };
  }
  return newState;
};

const completeAccount = (
  state = {
    companyAddresses: [],
    company_roles: [],
    office_types: []
  },
  action
) => {
  let newState = {};
  switch (action.type) {
    case "COMPLETE_ACCOUNT_SET_STATE": {
      newState = { ...state, ...action.newState };
      break;
    }
    case "COMPLETE_ACCOUNT_REDIRECT": {
      window.location.replace(action.url);
      break;
    }
    default:
      newState = { ...state };
  }
  return newState;
};

const inviteModal = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case "INVITE_MODAL_SHOW": {
      newState = { ...state, isOpen: true };
      break;
    }
    case "INVITE_MODAL_HIDE": {
      newState = { ...state, isOpen: false };
      break;
    }
    case "INVITE_MODAL_REMOVE_MODAL_SHOW": {
      newState = {
        ...state,
        removeModalIsOpen: true,
        remove: {
          member: action.member,
          property: action.property
        }
      };
      break;
    }
    case "INVITE_MODAL_REMOVE_MODAL_HIDE": {
      newState = { ...state, removeModalIsOpen: false };
      break;
    }
    case "GENERAL_REMOVE_MEMBER_COMPLETE": {
      newState = {
        ...state,
        removeModalIsOpen: false
      };
      break;
    }
    case "GENERAL_INVITE_MEMBER_COMPLETE": {
      newState = { ...state, isOpen: false };
      break;
    }
    default:
      newState = state;
  }
  return newState;
};

const uiStrings = (
  state = {
    strings: {},
    language: "en_us",
    version: {}
  },
  action
) => {
  let newState = {};
  switch (action.type) {
    case "UI_STRINGS_SET_STATE": {
      newState = _cloneDeep(state);
      const { language, strings, version } = action.data;
      newState.strings[language] = strings;
      newState.version[language] = version;
      break;
    }
    default:
      newState = state;
  }
  return newState;
};

export default combineReducers({
  general: dashboard,
  network,
  tutorial,
  createPassword,
  completeAccount,
  inviteModal,
  uiStrings
});
