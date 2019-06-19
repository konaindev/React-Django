import { states } from "../add_property_form/states";

export const props = {
  formProps: {
    post_url: null,
    packages: [
      { id: "accelerate", name: "Accelerate" },
      { id: "optimize", name: "Optimize" },
      { id: "ground", name: "Ground Up" },
      { id: "other", name: "Not Sure" }
    ],
    states
  }
};
