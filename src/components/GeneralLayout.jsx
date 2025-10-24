import React from 'react';
import './GeneralLayout.css';

const GeneralLayout = ({ children }) => {
  return (
    <div className="general-layout">
      <div className="layout-container">
        {children}
      </div>
    </div>
  );
};

export default GeneralLayout;