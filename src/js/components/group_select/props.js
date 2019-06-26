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
  container: provided => ({ ...provided, width: 200 })
};

const placeholder = "Select an option...";

export const props = {
  options,
  styles,
  placeholder
};

export const propsOneGroup = {
  options: [options[0]],
  styles,
  placeholder
};

export const propsScroll = {
  options: [
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
        { label: "Option 12", value: "option12" },
        { label: "Option 13", value: "option13" },
        { label: "Option 14", value: "option14" },
        { label: "Option 15", value: "option15" },
        { label: "Option 16", value: "option16" },
        { label: "Option 17", value: "option17" },
        { label: "Option 18", value: "option18" },
        { label: "Option 19", value: "option19" },
        { label: "Option 20", value: "option20" }
      ]
    },
    {
      label: "Group 4",
      options: [
        { label: "Option 21", value: "option21" },
        { label: "Option 22", value: "option22" },
        { label: "Option 23", value: "option23" },
        { label: "Option 24", value: "option24" }
      ]
    }
  ],
  styles,
  placeholder
};
