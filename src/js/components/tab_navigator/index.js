import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Container from '../container';
import './tab_navigator.scss';

export const Tab = ({ label, children }) => (
  <div className="tab-navigator__content">
    {children}
  </div>
);

export class TabNavigator extends Component {
  static propTypes = {
    children: PropTypes.node,
    onChange: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number.isRequired,
  };

  handleNavClick = index => event => {
    const { onChange, selectedIndex } = this.props;
    event.preventDefault();
    if (onChange && index !== selectedIndex) {
      onChange(index);
    }
  };

  render() {
    const {
      children,
      selectedIndex,
    } = this.props;
    const childrenArray = Array.isArray(children) ? children : [children];
    return (
      <div className="tab-navigator">
        <Container className="tab-navigator__navs">
          {childrenArray.map((child, index) => (
            child.type === Tab ? (
              <a
                className={cn('tab-navigator__nav-item', {
                  'tab-navigator__nav-item--active': selectedIndex === index
                })}
                href="#"
                key={index}
                onClick={this.handleNavClick(index)}>
                {child.props.label}
              </a>
            ) : null
          ))}
        </Container>
        <div className="tab-navigator__divider" />
        <Container>
          {childrenArray[selectedIndex]}
        </Container>
      </div>
    );
  }
}

TabNavigator.Tab = Tab;

export default TabNavigator;
