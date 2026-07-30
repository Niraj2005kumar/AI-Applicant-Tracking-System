import { createContext, useContext, useMemo, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const value = useMemo(() => ({ notifications, setNotifications }), [notifications]);

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
