import React from 'react';

import './container.scss';

export const Container = ({ children }) => (
  <div className="container">
    {children}
  </div>
);

export default Container;
