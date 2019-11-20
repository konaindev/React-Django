import { props as propertiesProps } from "../dashboard_page/props";

export const props = {
  isOpen: true,
  properties: propertiesProps.properties.slice(0, 1)
};

export const multiProps = {
  isOpen: true,
  properties: propertiesProps.properties.slice(0, 3)
};
