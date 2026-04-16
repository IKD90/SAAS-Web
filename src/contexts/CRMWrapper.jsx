import React from 'react';
import { CRMProvider } from './CRMContext';

const CRMWrapper = ({ children }) => {
  return (
    <CRMProvider>
      {children}
    </CRMProvider>
  );
};

export default CRMWrapper;

