import { createContext, useContext, useState } from 'react';
import Notification from '../components/common/Notification';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({ show: false });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false });
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ show: false })}
      />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);