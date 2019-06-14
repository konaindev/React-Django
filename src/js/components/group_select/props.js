const options = [
  {
    label: "Group 1",
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
      { label: "Option 4", value: "option4" }
    ]
  },
  {
    label: "Group 2",
    options: [
      { label: "Option 5", value: "option5" },
      { label: "Option 6", value: "option6" },
      { label: "Option 7", value: "option7" },
      { label: "Option 8", value: "option8" }
    ]
  },
  {
    label: "Group 3",
    options: [
      { label: "Option 9", value: "option9" },
      { label: "Option 10", value: "option10" },
      { label: "Option 11", value: "option11" },
      { label: "Option 12", value: "option12" }
    ]
  }
];

const styles = {
  container: provided => ({ ...provided, width: 200 }),
  menu: provided => ({ ...provided, width: 560 })
};

export const props = {
  options,
  styles,
  placeholder: "Select an option..."
};
