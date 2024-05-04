import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const PlannerContext = createContext(undefined);

/*
 * Use context provider because multiply nested components will read/update planner state
 */

function PlannerContextProvider({ children, dayId }) {
  const [plannedEvents, setPlannedEvents] = useState([]); // PlannedEvent[]
  const [isEdit, setIsEdit] = useState(false);
  const [currEvent, setCurrEvent] = useState({});

  return (
    <PlannerContext.Provider
      value={{
        plannedEventsContext: [plannedEvents, setPlannedEvents],
        dayId,
        editContext: [isEdit, setIsEdit],
        currEventContext: [currEvent, setCurrEvent]
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

PlannerContextProvider.propTypes = {
  children: PropTypes.array,
  dayId: PropTypes.number
}

export { PlannerContextProvider, PlannerContext };
