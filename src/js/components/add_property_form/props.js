import { states } from "./states";

export const props = {
  post_url: null,
  packages: [
    { id: "accelerate", name: "Accelerate" },
    { id: "optimize", name: "Optimize" },
    { id: "ground", name: "Ground Up" },
    { id: "other", name: "Not Sure" }
  ],
  states
};
