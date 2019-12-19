export const project = {
  public_id: "pro_example",
  name: "Portland Multi Family",
  building_image: [
    "https://i.imgur.com/UEH4gfU.jpg",
    "https://i.imgur.com/UEH4gfU.jpg",
    "https://i.imgur.com/UEH4gfU.jpg"
  ],
  health: 2,
  update_endpoint: "/projects/pro_example/update/"
};

const suggestedTags = [
  { word: "Tag 1", count: 5 },
  { word: "Test Tag 2", count: 3 },
  { word: "Lake Highland Properties 3", count: 2 },
  { word: "New Tag", count: 1 }
];

export default { project, suggestedTags };
