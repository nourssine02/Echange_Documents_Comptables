import React from 'react';

export const Dropdown = ({ children }) => (
  <div className="dropdown">{children}</div>
);

export const DropdownButton = ({ children, plain, ...props }) => (
  <button className={`dropdown-button ${plain ? 'plain' : ''}`} {...props}>
    {children}
  </button>
);

export const DropdownMenu = ({ children, anchor }) => (
  <div className={`dropdown-menu ${anchor}`}>{children}</div>
);

export const DropdownItem = ({ children }) => (
  <div className="dropdown-item">{children}</div>
);
