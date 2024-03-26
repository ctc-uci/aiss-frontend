import { createContext, useState } from 'react';

const PlannerContext = createContext(undefined);

/*
 * Use context provider because multiply nested components will read/update planner state
 */

// eslint-disable-next-line react/prop-types
function PlannerContextProvider({ children, dayId }) {
  const [plannedEvents, setPlannedEvents] = useState([]); // PlannedEvent[]

  return (
    <PlannerContext.Provider
      value={{
        plannedEventsContext: [plannedEvents, setPlannedEvents],
        dayId
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export { PlannerContextProvider, PlannerContext };
