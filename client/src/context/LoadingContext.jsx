import React, { createContext, useContext, useState } from 'react';
import LoadingOverlay from '../components/common/LoadingOverlay';

const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      <LoadingOverlay isLoading={isLoading}>
        {children}
      </LoadingOverlay>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;