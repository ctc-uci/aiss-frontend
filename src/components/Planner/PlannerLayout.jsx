import s from './PlannerLayout.module.css';
import PlannerTimeline from './PlannerTimeline/PlannerTimeline';
import PlannerEvents from './PlannerEvents/PlannerEvents';
import { PlannerContextProvider } from './PlannerContext';
import PropTypes from 'prop-types';
import { useState } from 'react';

const PlannerLayout = ({ dayId, onClose }) => {

  const [isEditingEvent, setIsEditingEvent] = useState(false);

  return (
    <main id={s['planner-page-layout']}>
      <PlannerContextProvider dayId={dayId}>
        <PlannerTimeline setIsEditingEvent={setIsEditingEvent}/>
        <PlannerEvents onClose={onClose} isEditingEvent={isEditingEvent} setIsEditingEvent={setIsEditingEvent}/>
      </PlannerContextProvider>
    </main>
  );
};

PlannerLayout.propTypes = {
  dayId: PropTypes.number,
  onClose: PropTypes.func,
};

export default PlannerLayout;
