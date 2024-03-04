import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Step 1: Create the context
const DayIdContext = createContext(null);

// Step 2: Create the context provider
export const DayIdProvider = ({ children }) => {
  const [dayId, setDayId] = useState(null);

  return (
    <DayIdContext.Provider value={{ dayId, setDayId }}>
      {children}
    </DayIdContext.Provider>
  );
};

// Validate the children prop
DayIdProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };  

export { DayIdContext };
