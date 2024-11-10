import React, { createContext, useEffect, useState } from "react";

export const Storecontext = createContext(null);

const StorecontextProvider = (props) => {
  const [adminLogin, setAdminLogin] = useState(
    JSON.parse(localStorage.getItem("adminLogin")) || false
  );
  const [adminName, setAdminName] = useState(
    localStorage.getItem("adminName") || ""
  );
  const [adminId, setAdminId] = useState(
    localStorage.getItem("adminId") || ""
  );
  const [adminState, setAdminState] = useState(
    localStorage.getItem("adminState") || "Sign out"
  );
  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem("adminEmail") || ""
  );

  // Save all states to local storage whenever any of them change
  useEffect(() => {
    localStorage.setItem("adminLogin", JSON.stringify(adminLogin));
    localStorage.setItem("adminName", adminName);
    localStorage.setItem("adminId", adminId);
    localStorage.setItem("adminState", adminState);
    localStorage.setItem("adminEmail", adminEmail);
  }, [adminLogin, adminName, adminId, adminState, adminEmail]);

  const contextValue = {
    adminLogin,
    setAdminLogin,
    adminId,
    setAdminId,
    adminName,
    setAdminName,
    adminEmail,
    setAdminEmail,
    adminState,
    setAdminState
  };

  return (
    <Storecontext.Provider value={contextValue}>
      {props.children}
    </Storecontext.Provider>
  );
};

export default StorecontextProvider;
