export const general = {
  set: newState => ({
    type: "GENERAL_SET_STATE",
    newState
  }),
  update: {
    type: "GENERAL_UPDATE_STATE"
  }
};

export const tutorial = {
  set: newState => ({
    type: "TUTORIAL_SET_STATE",
    newState
  })
};
