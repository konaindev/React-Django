/**
 * @file Simple tools for getting page-wide ("global") data values.
 */

/**
 * @description Extract a javascript object from the page.
 *
 * The provided id should be the identity of a <script> tag on the page
 * that contains "global" data in the form of a JSON structure.
 *
 * These values can be created using Django 2.1's json_script tag.
 */
export const getGlobalData = id => {
  const element = document.getElementById(id);
  const data = element ? JSON.parse(element.textContent) : {};
  return data;
};
