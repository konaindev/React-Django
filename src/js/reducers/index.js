import { combineReducers } from "redux";
import { testActions } from "../actions";

/*
    this file contains a stub reducer; take in state and emit
    state back out (as a new object via spread).

*/

const test = (state = {}, action) => {
  let newState = {};

  switch (action.type) {
    case testActions.makeTrue.value: {
      newState = { ...state, test: true };
      break;
    }
    case testActions.makeFalse.value: {
      newState = { ...state, test: false };
    }
    case testActions.toggle.value: {
      newState = { ...state, test: !!!state.test };
    }
    default:
      newState = { ...state };
  }
  // implementation detail: common reducer patters have mutliple returns...
  //                        ...something that for some reason bothers me... -jc
  return newState;
};

/*
    combineReducers() will emit an object with a prop
    for each reducer, with that prop containing the portion
    of the state tree the reducer acts on:

    combineReducers({ test, cats })

    would emit an object shaped like:

    {
        test: {
            // the "test" reducer's branch of the state tree
        },
        cats: {
            // the "cats" reducer's branch of the state tree
        }
    }
*/

export default combineReducers({ test });
