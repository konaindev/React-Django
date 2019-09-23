const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" }
];

const options2 = [
  { label: "Option 5", value: "option5" },
  { label: "Option 6", value: "option6" },
  { label: "Option 7", value: "option7" },
  { label: "Option 8", value: "option8" },
  { label: "Option 9", value: "option9" },
  { label: "Option 10", value: "option10" }
];

const styles = {
  valueContainer: provided => ({ ...provided, height: "18px" }),
  container: provided => ({ ...provided, width: 400 })
};

export const props = {
  options,
  styles,
  placeholder: "Select an option...",
  name: "select"
};

export const propsScroll = {
  options: [...options, ...options2],
  styles,
  placeholder: "Select an option...",
  name: "select"
};

export const geoOptions = [
  {
    value: "1730 Minor Avenue Lansing, MI",
    label: "1730 Minor Avenue Lansing, MI"
  },
  {
    value: "568 7th Avenue New York, NY",
    label: "568 7th Avenue New York, NY"
  },
  {
    value: "89 Yucatan Drive Los Angeles, CA",
    label: "89 Yucatan Drive Los Angeles, CA"
  },
  {
    value: "908 First Avenue San Francisco, CA",
    label: "908 First Avenue San Francisco, CA"
  },
  {
    value: "908 Second Avenue New York, NY",
    label: "908 Second Avenue New York, NY"
  },
  {
    value: "908 Third Avenue Los Angeles, CA",
    label: "908 Third Avenue Los Angeles, CA"
  },
  {
    value: "667 Marquee Lane, Seattle WA",
    label: "667 Marquee Lane, Seattle WA"
  }
];

export const propsGroup = {
  options: [
    {
      label: "Group 1",
      options: options
    },
    {
      label: "Group 2",
      options: options2
    }
  ],
  styles
};

export const descriptionOption = [
  {
    label: "Admin",
    description:
      "People can edit property information, start campaigns and invite members",
    value: "admin"
  },
  {
    label: "Member",
    description:
      "People can view property info and control their notification preferences",
    value: "member"
  }
];
