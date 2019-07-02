/*
    this file contains the "actions" which reducers act on.

    in this instance, i have exported a series of objects, each
    representing an "action", such as changing the 'test' prop to false.
    the 'type' prop is what is used by the reducer to match actions...
*/

export const testActions = {
  makeFalse: {
    type: "TEST_FALSE"
  },
  makeTrue: {
    type: "TEST_TRUE"
  },
  toggle: {
    type: "TEST_TOGGLE"
  }
};

export const otherAction = {
  myOtherAction: {
    type: "SUPER_COOL_ACTION"
  }
};

// in this example i have a function that acts as an "action creator", emitting
// an object derived from  "testActions" and extended to add other data

export const testActionCreator = opts => ({
  ...testActions.makeTrue,
  opts,
  more: "data is rad...and this will all be recieved by the reducer! yay!"
});
