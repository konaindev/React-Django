import { combineReducers } from "redux";
import { general } from "../actions";

const initState = {
  tutorialView: {}
};

const dashboard = (state = {}, action) => {
  let newState = {};
  switch (action.type) {
    case "GENERAL_SET_STATE": {
      newState = { ...action.newState };
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
    case "CREATE_PASSWORD_": {
      newState = { ...state, tutorialView: action.newState };
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
    default:
      newState = { ...state };
  }
  return newState;
};

export default combineReducers({
  general: dashboard,
  network,
  tutorial,
  createPassword,
  completeAccount
});
