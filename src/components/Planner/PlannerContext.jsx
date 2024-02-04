import { createContext, useState } from 'react';

const PlannerContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
function PlannerContextProvider({ children }) {
  const [plannedEvents, setPlannedEvents] = useState([]);

  return (
    <PlannerContext.Provider
      value={{
        plannedEventsContext: [plannedEvents, setPlannedEvents],
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export { PlannerContextProvider, PlannerContext };
