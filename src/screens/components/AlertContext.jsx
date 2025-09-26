import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [selectedAlertData, setSelectedAlertData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectAlert = (data) => {
    setSelectedAlertData(data);
  };

  const setLoading = (loading) => {
    setIsLoading(loading);
  };

  return (
    <AlertContext.Provider
      value={{
        selectedAlertData,
        selectAlert,
        isLoading,
        setLoading,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
