import React from "react";
import PropTypes from "prop-types";

const IconBase = props => {
  const {
    children,
    className,
    component: Component,
    color,
    titleAccess,
    viewBox,
    size,
    width,
    height,
    ...other
  } = props;

  return (
    <Component
      className={className}
      focusable="false"
      viewBox={viewBox}
      color={color}
      aria-hidden={titleAccess ? "false" : "true"}
      role={titleAccess ? "img" : "presentation"}
      ref={ref}
      width={size || width}
      height={size || height}
      {...other}
    >
      {children}
      {titleAccess ? <title>{titleAccess}</title> : null}
    </Component>
  );
};

IconBase.propTypes = {
  /**
   * Node passed into the SVG element.
   */
  children: PropTypes.node.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Applies a color attribute to the SVG element.
   */
  color: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: PropTypes.elementType,
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: PropTypes.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   */
  viewBox: PropTypes.string,
  /**
   * Sets the custom width of the SVG
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Sets the custom height of the SVG
   */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Sets the equal width and height of the SVG,
   * with higher priority than width & height props
   */
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

IconBase.defaultProps = {
  color: "inherit",
  component: "svg",
  viewBox: "0 0 16 16",
  width: "1em",
  height: "1em"
};

export default IconBase;
