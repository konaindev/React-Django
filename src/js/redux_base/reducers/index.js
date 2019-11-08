import _cloneDeep from "lodash/cloneDeep";
import { combineReducers } from "redux";

import dashboard from "./dashboard";
import portfolio from "./portfolio";
import projectReports from "./project_reports";
import inviteModal from "./invite_modal";

const initState = {
  tutorialView: {}
};

const token = (state = { refresh: null, access: null }, action) => {
  let newState = {};
  switch (action.type) {
    case "UPDATE_TOKEN": {
      newState = { ...action.token };
      break;
    }
    case "CLEAR_TOKEN": {
      newState = {};
      break;
    }
    default:
      newState = state;
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
      newState = state;
  }
  return newState;
};

const network = (state = { isFetching: false, errors: [] }, action) => {
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
    case "NETWORK_FETCH_FAIL": {
      newState = { ...state };
      newState.errors.push({ message: action.message, timestamp: new Date() });
      break;
    }
    default:
      newState = state;
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
      newState = state;
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
      newState = state;
  }
  return newState;
};

const pageMeta = (state = { title: "Remarkably" }, action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_PAGE_TITLE": {
      newState = { ...state, title: action.title };
    }
    default:
      newState = state;
  }
  return newState;
};

const nav = (state = {}, action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_NAVLINKS":
      newState = { ...state, navLinks: action.navLinks };
      break;
    case "UPDATE_HEADER_ITEMS":
      newState = { ...state, headerItems: action.headerItems };
    default:
      newState = state;
  }
  return newState;
};

const user = (state = {}, action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_USER":
      newState = { ...action.x };
      break;
    default:
      newState = state;
  }
  return newState;
};

const properties = (state = [], action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_PROPERTIES":
      newState = action.x;
      break;
    default:
      newState = state;
  }
  return newState;
};

const funds = (state = [], action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_FUNDS":
      newState = action.x;
      break;
    default:
      newState = state;
  }
  return newState;
};

const property_managers = (state = [], action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_PROPERTY_MANAGERS":
      newState = action.x;
      break;
    default:
      newState = state;
  }
  return newState;
};

const asset_managers = (state = [], action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_ASSET_MANAGERS":
      newState = action.x;
      break;
    default:
      newState = state;
  }
  return newState;
};

const locations = (state = [], action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_LOCATIONS":
      newState = action.x;
      break;
    default:
      newState = state;
  }
  return newState;
};

const project = (state = {}, action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_PROJECT":
      newState = action.x;
      break;
    case "MERGE_INTO_PROJECT":
      newState = { ...state, ...action.x };
    default:
      newState = state;
  }
  return newState;
};

const market = (state = {}, action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_MARKET":
      newState = action.x;
      break;
    default:
      newState = state;
  }
  return newState;
};

const kpi = (state = {}, action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_KPI":
      newState = action.x;
      break;
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
  network,
  uiStrings,
  dashboard,
  projectReports,
  portfolio,
  inviteModal,
  tutorial,
  createPassword,
  completeAccount,
  token,
  pageMeta,
  nav,
  user,
  properties,
  funds,
  property_managers,
  asset_managers,
  locations,
  project,
  market,
  kpi
});
