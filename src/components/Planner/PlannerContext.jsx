import { createContext, useState } from 'react';

const PlannerContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
function PlannerContextProvider({ children }) {
  const [plannedEvents, setPlannedEvents] = useState([]);
  const [overlayIsVisible, setOverlayIsVisible] = useState(false);

  return (
    <PlannerContext.Provider
      value={{
        plannedEventsContext: [plannedEvents, setPlannedEvents],
        overlayIsVisibleContext: [overlayIsVisible, setOverlayIsVisible],
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export { PlannerContextProvider, PlannerContext };
