const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" }
];

const styles = {
  container: provided => ({ ...provided, width: 400 })
};

const placeholder = "Select an option...";

export const props = { options, styles, placeholder };

export const propsLong = {
  options: [
    { label: "Option loooooooooooooong loooooooooooooong 1", value: "option1" },
    { label: "Option loooooooooooooong loooooooooooooong 2", value: "option2" },
    { label: "Option loooooooooooooong loooooooooooooong 3", value: "option3" },
    { label: "Option loooooooooooooong loooooooooooooong 4", value: "option4" }
  ],
  styles: {
    container: provided => ({ ...provided, width: 200 }),
    menu: provided => ({ ...provided, width: 350 })
  },
  placeholder
};

export const propsScroll = {
  options: [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Option 4", value: "option4" },
    { label: "Option 5", value: "option5" },
    { label: "Option 6", value: "option6" },
    { label: "Option 7", value: "option7" },
    { label: "Option 8", value: "option8" },
    { label: "Option 9", value: "option9" },
    { label: "Option 10", value: "option10" }
  ],
  styles,
  placeholder
};
