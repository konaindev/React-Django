const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" }
];

const styles = {
  container: provided => ({ ...provided, width: 400 })
};

export const props = {
  options,
  styles,
  placeholder: "Select an option...",
  name: "select"
};
