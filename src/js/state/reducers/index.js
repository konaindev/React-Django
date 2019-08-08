import { combineReducers } from "redux";
import { general } from "../actions";

export default (state = {}, action) => {
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

// TODO: flatten the reducer for now, since it will take
//       some time to untangle the FE arch -jc
// export default combineReducers({ general });
