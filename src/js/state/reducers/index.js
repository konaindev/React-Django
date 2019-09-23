import { combineReducers } from "redux";

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
    default:
      newState = state;
  }
  return newState;
};

const dashboard = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case "GENERAL_SET_STATE": {
      newState = { ...action.newState };
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

const portfolio = (state = {}, action) => {
  let newState = undefined;

  switch (action.type) {
    case "UPDATE_PORTFOLIO":
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

export default combineReducers({
  general: dashboard,
  network,
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
  portfolio,
  asset_managers,
  locations
});
