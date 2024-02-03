import { createContext, useState } from 'react';

const UserContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
function UserProvider({ children }) {
  const [plannedEvents, setPlannedEvents] = useState([]);

  return (
    <UserContext.Provider value={{ plannedEvents: [plannedEvents, setPlannedEvents] }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
